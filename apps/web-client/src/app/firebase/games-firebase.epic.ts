import {
  Establishment,
  EstablishmentId,
  Game,
  GameContext,
  GameId,
  GameMachineMessage,
  Landmark,
  LandmarkId,
} from '@machikoro/game-server-contracts';
import { ref, Database } from 'firebase/database';
import { httpsCallable, Functions } from 'firebase/functions';
import { ref as storageRef, FirebaseStorage, getDownloadURL } from 'firebase/storage';
import { AnyAction } from 'redux';
import { object } from 'rxfire/database';
import {
  catchError,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { JoinGameAction, GameAction, AbandonGameAction } from '../game';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

import { FirebaseAction } from './firebase.actions';

const getImageSrc = (
  firestorage: FirebaseStorage,
) => async (imagePath: string) => getDownloadURL(storageRef(firestorage, imagePath)).catch((reason) => {
  // eslint-disable-next-line no-console
  console.error(`Failed to load image for ${imagePath}`, reason);

  return undefined;
});

const populateEstablishmentsImages = (
  firestorage: FirebaseStorage,
) => async (establishments: Record<EstablishmentId, Establishment>) => {
  const establishmentsWithImages = await Promise.all(Object.values(establishments).map(async (establishment) => {
    if (!establishment.imagePath) return [establishment.establishmentId, establishment] as const;

    const imageSrc = await getImageSrc(firestorage)(establishment.imagePath);

    const establishmentWithImage: Establishment = {
      ...establishment,
      imageSrc,
    };

    return [establishment.establishmentId, establishmentWithImage] as const;
  }));

  return Object.fromEntries(establishmentsWithImages) as Record<EstablishmentId, Establishment>;
};

const populateLandmarksImages = (
  firestorage: FirebaseStorage,
) => async (landmarks: Record<LandmarkId, Landmark>) => {
  const landmarksWithImagesPromises = await Promise.all(Object.values(landmarks).map(async (landmark) => {
    if (!landmark.imagePath) return [landmark.landmarkId, landmark] as const;

    const imageSrc = await getImageSrc(firestorage)(landmark.imagePath);

    const landmarkWithImage: Landmark = {
      ...landmark,
      imageSrc,
    };

    return [landmark.landmarkId, landmarkWithImage] as const;
  }));

  return Object.fromEntries(landmarksWithImagesPromises) as Record<LandmarkId, Landmark>;
};

type SyncGameStateDependencies = {
  firebaseDb: Database;
  firestorage: FirebaseStorage;
};

const syncGameState = (deps: SyncGameStateDependencies): TypedEpic<typeof GameAction.setGameDocument> => (actions$) => actions$.pipe(
  ofType(JoinGameAction.joinGameResolvedEvent),
  toPayload(),
  switchMap((gameId) => object(ref(deps.firebaseDb, `games/${gameId}`)).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(AbandonGameAction.abandonGameResolvedEvent))),
    // TODO: perform validation
    map((gameChange) => {
      const gameWithoutId = gameChange.snapshot.val() as Omit<Game, 'gameId'>;

      return {
        ...gameWithoutId,
        gameId: gameChange.snapshot.key as GameId,
      };
    }),
    switchMap((game) => forkJoin([
      from(populateEstablishmentsImages(deps.firestorage)(game.context.gameEstablishments)),
      from(populateLandmarksImages(deps.firestorage)(game.context.gameLandmarks)),
    ]).pipe(
      map(([establishmentsWithImages, landmarksWithImages]) => {
        const gameWithImages: Game = {
          ...game,
          context: {
            ...game.context,
            gameEstablishments: establishmentsWithImages,
            gameLandmarks: landmarksWithImages,
          },
        };

        return gameWithImages;
      }),
    )),
    map(GameAction.setGameDocument),
  )),
);

const appActionTypeToGameMachineMessageTypeMap = {
  [GameAction.rollDiceCommand.type]: 'ROLL_DICE',
  [GameAction.passCommand.type]: 'PASS',
  [GameAction.buildEstablishmentCommand.type]: 'BUILD_ESTABLISHMENT',
  [GameAction.buildLandmarkCommand.type]: 'BUILD_LANDMARK',
} as const;

type MapAppActionsToGameMachineActionsDependencies = {
  firebaseFunctions: Functions;
};

const mapAppActionsToGameMachineActions = (deps: MapAppActionsToGameMachineActionsDependencies): TypedEpic<
| typeof FirebaseAction.postMessageResolvedEvent
| typeof FirebaseAction.postMessageRejectedEvent
> => (actions$, state$) => actions$.pipe(
  ofType(
    GameAction.rollDiceCommand,
    GameAction.passCommand,
    GameAction.buildEstablishmentCommand,
    GameAction.buildLandmarkCommand,
  ),
  withLatestFrom(state$),
  switchMap(([action, state]) => {
    const gameMachineMessageType = appActionTypeToGameMachineMessageTypeMap[action.type];
    const { gameId } = state.gameReducer.game!;

    const postGameMessage = httpsCallable<{ gameId: string; message: Omit<GameMachineMessage, 'userId'> }, GameContext>(
      deps.firebaseFunctions,
      'postGameMessage',
    );

    const message = 'payload' in action
      ? { type: gameMachineMessageType, payload: action.payload }
      : { type: gameMachineMessageType };

    return from(postGameMessage({ gameId, message })).pipe(
      map((result) => FirebaseAction.postMessageResolvedEvent(result.data)),
      catchError((error) => of(FirebaseAction.postMessageRejectedEvent(error))),
    );
  }),
);

export type FirebaseGamesEpicDependencies =
  & SyncGameStateDependencies
  & MapAppActionsToGameMachineActionsDependencies;

export const firebaseGamesEpic = (deps: FirebaseGamesEpicDependencies) => typedCombineEpics<AnyAction>(
  syncGameState(deps),
  mapAppActionsToGameMachineActions(deps),
);
