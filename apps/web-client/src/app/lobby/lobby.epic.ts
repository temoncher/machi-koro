import { Game, PlayerConnectionStatus } from '@machikoro/game-server-contracts';
import { map, withLatestFrom } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { GetNamespaceActionType } from '../utils/createActionsNamespace';
import { waitUntilAuthorized } from '../utils/waitUntilAuthorized';

import { LobbyAction } from './lobby.actions';
import { CreateGameAction, LeaveLobbyAction, JoinLobbyAction } from './lobby.endpoints';

const joinLobbyOnLobbyPageEnteredEventEpic: TypedEpic<typeof JoinLobbyAction.joinLobbyCommand> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.enteredLobbyPageEvent),
  toPayload(),
  waitUntilAuthorized(state$),
  map(([lobbyId, { userId, username }]) => JoinLobbyAction.joinLobbyCommand([{ userId, username }, lobbyId])),
);

// TODO?: leave lobby when navigating out of lobbies page?
const leaveLobbyOnLeaveLobbyButtonClickedEvent: TypedEpic<typeof LeaveLobbyAction.leaveLobbyCommand> = (actions$, state$) => actions$.pipe(
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

const createGameOnCreateGameButtonClickedEvent: TypedEpic<typeof CreateGameAction.createGameCommand> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.createGameButtonClickedEvent),
  waitUntilAuthorized(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, { userId }]) => userId),
  withLatestFrom(state$),
  map(([currentUserId, state]) => {
    // TODO: error handling
    const { users } = state.lobbyReducer.lobby!;

    // TODO?: probably should be inside cloud function
    const playersConnectionStatuses = Object.fromEntries(
      Object.keys(users!).map((userId) => [userId, PlayerConnectionStatus.DISCONNECTED]),
    );

    const partialGame: Omit<Game, 'gameId'> = {
      hostId: currentUserId,
      players: users!,
      playersConnectionStatuses,
    };

    return CreateGameAction.createGameCommand([partialGame]);
  }),
);

export const lobbyEpic = typedCombineEpics<
| LobbyAction
| GetNamespaceActionType<typeof JoinLobbyAction>
| GetNamespaceActionType<typeof LeaveLobbyAction>
| GetNamespaceActionType<typeof CreateGameAction>
>(
  joinLobbyOnLobbyPageEnteredEventEpic,
  leaveLobbyOnLeaveLobbyButtonClickedEvent,
  createGameOnCreateGameButtonClickedEvent,
);
