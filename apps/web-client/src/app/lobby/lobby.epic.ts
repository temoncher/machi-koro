import { map, withLatestFrom } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { GetNamespaceActionType } from '../utils/createActionsNamespace';
import { waitUntilAuthorized } from '../utils/waitUntilAuthorized';

import { JoinLobbyAction } from './joinLobby.endpoint';
import { LeaveLobbyAction } from './leaveLobby.endpoint';
import { LobbyAction } from './lobby.actions';

const joinLobbyOnLobbyPageEnteredEventEpic: TypedEpic<typeof JoinLobbyAction.joinLobbyCommand> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.enteredLobbyPageEvent),
  toPayload(),
  waitUntilAuthorized(state$),
  map(([lobbyId, { userId, username }]) => JoinLobbyAction.joinLobbyCommand([{ userId, username }, lobbyId])),
);

// TODO?: leave lobby when navigating out of lobbies page?
const leaveLobbyOnLeaveLobbyButtonClickEvent: TypedEpic<typeof LeaveLobbyAction.leaveLobbyCommand> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.leaveLobbyButtonClickedEvent),
  waitUntilAuthorized(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, { userId }]) => userId),
  withLatestFrom(state$),
  map(([userId, state]) => {
    // TODO: error handling
    const { lobbyId } = state.lobbyReducer.lobby!;

    return LeaveLobbyAction.leaveLobbyCommand([userId, lobbyId]);
  }),
);

export const lobbyEpic = typedCombineEpics<
| LobbyAction
| GetNamespaceActionType<typeof JoinLobbyAction>
| GetNamespaceActionType<typeof LeaveLobbyAction>
>(
  joinLobbyOnLobbyPageEnteredEventEpic,
  leaveLobbyOnLeaveLobbyButtonClickEvent,
);
