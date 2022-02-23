import {
  from,
  map,
  mapTo,
  switchMap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { GetNamespaceActionType } from '../utils/createActionsNamespace';
import { waitUntilAuthorized } from '../utils/waitUntilAuthorized';

import { JoinLobbyAction } from './joinLobby.endpoint';
import { LeaveLobby } from './lobbies.api.types';
import { LobbyAction } from './lobby.actions';

const joinLobbyOnLobbyPageEnteredEventEpic: TypedEpic<typeof JoinLobbyAction.joinLobbyCommand> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.enteredLobbyPageEvent),
  toPayload(),
  waitUntilAuthorized(state$),
  map(([lobbyId, { userId, username }]) => JoinLobbyAction.joinLobbyCommand([{ userId, username }, lobbyId])),
);

type LeaveLobbyEpicDependencies = {
  leaveLobby: LeaveLobby;
};

// TODO?: leave lobby when navigating out of lobbies page?
const leaveLobbyEpic = (
  deps: LeaveLobbyEpicDependencies,
): TypedEpic<typeof LobbyAction.currentUserLeftLobbyEvent> => (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.leaveLobbyCommand),
  toPayload(),
  waitUntilAuthorized(state$),
  switchMap(([lobbyId, { userId }]) => from(deps.leaveLobby(userId, lobbyId)).pipe(
    // `mapTo` really accepts `any` payload, therefore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    mapTo(LobbyAction.currentUserLeftLobbyEvent(lobbyId)),
    // TODO: error handling
  )),
);

export type LobbyEpicDependencies = LeaveLobbyEpicDependencies;

export const lobbyEpic = (deps: LobbyEpicDependencies) => typedCombineEpics<LobbyAction | GetNamespaceActionType<typeof JoinLobbyAction>>(
  joinLobbyOnLobbyPageEnteredEventEpic,
  leaveLobbyEpic(deps),
);
