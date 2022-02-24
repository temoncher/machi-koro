import { map, withLatestFrom } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { waitUntilAuthorized } from '../utils/waitUntilAuthorized';

import { GameAction } from './game.actions';
import { AbandonGameAction, JoinGameAction } from './game.endpoints';

const joinGameOnGamePageEnteredEventEpic: TypedEpic<typeof JoinGameAction.joinGameCommand> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.enteredGamePageEvent),
  toPayload(),
  waitUntilAuthorized(state$),
  map(([gameId, user]) => JoinGameAction.joinGameCommand([user, gameId])),
);

const abandonGameOnAbandonGameClickEventEpic: TypedEpic<typeof AbandonGameAction.abandonGameCommand> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.abandonGameButtonClickedEvent),
  waitUntilAuthorized(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, user]) => user),
  withLatestFrom(state$),
  map(([user, state]) => {
    // TODO: error handling
    const { gameId } = state.gameReducer.game!;

    return AbandonGameAction.abandonGameCommand([user, gameId]);
  }),
);

export const gameEpic = typedCombineEpics<
| GameAction
| JoinGameAction
| AbandonGameAction
>(
  joinGameOnGamePageEnteredEventEpic,
  abandonGameOnAbandonGameClickEventEpic,
);
