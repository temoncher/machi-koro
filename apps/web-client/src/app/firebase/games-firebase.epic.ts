import { Game, GameId } from '@machikoro/game-server-contracts';
import { Database, ref } from 'firebase/database';
import { Functions } from 'firebase/functions';
import { AnyAction } from 'redux';
import { object } from 'rxfire/database';
import {
  from,
  ignoreElements,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { JoinGameAction, GameAction, AbandonGameAction } from '../game';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

import { postGameMessage } from './games-firebase.api';

type SyncGameStateDependencies = {
  firebaseDb: Database;
};

const syncGameState = (
  deps: SyncGameStateDependencies,
): TypedEpic<typeof GameAction.setGameDocument> => (actions$) => actions$.pipe(
  ofType(JoinGameAction.joinGameResolvedEvent),
  toPayload(),
  switchMap((gameId) => object(ref(deps.firebaseDb, `games/${gameId}`)).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(AbandonGameAction.abandonGameResolvedEvent))),
    map((gameChange) => {
      // TODO: perform validation
      const game = gameChange.snapshot.val() as Omit<Game, 'gameId'>;

      return GameAction.setGameDocument({
        ...game,
        gameId: gameChange.snapshot.key as GameId,
      });
    }),
  )),
);

const appActionTypeToGameMachineMessageTypeMap = {
  [GameAction.rollDiceCommand.type]: 'ROLL_DICE',
} as const;

type MapAppActionsToGameMachineActionsDependencies = {
  firebaseFunctions: Functions;
};

const mapAppActionsToGameMachineActions = (
  deps: MapAppActionsToGameMachineActionsDependencies,
): TypedEpic<never> => (actions$, state$) => actions$.pipe(
  ofType(GameAction.rollDiceCommand),
  withLatestFrom(state$),
  switchMap(([action, state]) => {
    const gameMachineMessageType = appActionTypeToGameMachineMessageTypeMap[action.type];
    const { gameId } = state.gameReducer.game!;

    return from(postGameMessage(deps.firebaseFunctions)({ gameId, message: { type: gameMachineMessageType } }));
  }),
  ignoreElements(),
);

export type FirebaseGamesEpicDependencies =
  & SyncGameStateDependencies
  & MapAppActionsToGameMachineActionsDependencies;

export const firebaseGamesEpic = (deps: FirebaseGamesEpicDependencies) => typedCombineEpics<AnyAction>(
  syncGameState(deps),
  mapAppActionsToGameMachineActions(deps),
);
