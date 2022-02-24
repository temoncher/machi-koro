import { Game, GameId } from '@machikoro/game-server-contracts';
import { Database, ref } from 'firebase/database';
import { AnyAction } from 'redux';
import { object } from 'rxfire/database';
import {
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { JoinGameAction, GameAction, AbandonGameAction } from '../game';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

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

export type FirebaseGamesEpicDependencies =
  & SyncGameStateDependencies;

export const firebaseGamesEpic = (deps: FirebaseGamesEpicDependencies) => typedCombineEpics<AnyAction>(
  syncGameState(deps),
);
