import { map, withLatestFrom } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { waitUntilAuthorized } from '../utils/waitUntilAuthorized';

import { LobbyAction } from './lobby.actions';
import { CreateGameAction, LeaveLobbyAction, JoinLobbyAction } from './lobby.endpoints';

const joinLobbyOnLobbyPageEnteredEventEpic: TypedEpic<typeof JoinLobbyAction.joinLobbyCommand> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.enteredLobbyPageEvent),
  toPayload(),
  waitUntilAuthorized(state$),
  map(([lobbyId, { userId, username }]) => JoinLobbyAction.joinLobbyCommand([{ userId, username }, lobbyId])),
);

const dispatchLeaveLobbyCommandOnLeftLobbyPageEvent: TypedEpic<
typeof LeaveLobbyAction.leaveLobbyCommand
> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.leftLobbyPageEvent),
  toPayload(),
  waitUntilAuthorized(state$),
  map(([lobbyId, { userId }]) => LeaveLobbyAction.leaveLobbyCommand([userId, lobbyId])),
);

const createGameOnCreateGameButtonClickedEvent: TypedEpic<typeof CreateGameAction.createGameCommand> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.createGameButtonClickedEvent),
  waitUntilAuthorized(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, { userId }]) => userId),
  withLatestFrom(state$),
  map(([currentUserId, state]) => {
    // TODO: error handling
    const lobby = state.lobbyReducer.lobby!;

    return CreateGameAction.createGameCommand([lobby, currentUserId]);
  }),
);

export const lobbyEpic = typedCombineEpics<
| LobbyAction
| JoinLobbyAction
| LeaveLobbyAction
| CreateGameAction
>(
  joinLobbyOnLobbyPageEnteredEventEpic,
  createGameOnCreateGameButtonClickedEvent,
  dispatchLeaveLobbyCommandOnLeftLobbyPageEvent,
);
