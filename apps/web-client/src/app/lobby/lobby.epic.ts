import {
  catchError,
  from,
  map,
  mapTo,
  of,
  switchMap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { waitUntilAuthorized } from '../utils/waitUntilAuthorized';

import { JoinLobby, LeaveLobby } from './lobbies.api.types';
import { LobbyAction } from './lobby.actions';

const joinLobbyOnLobbyPageEnteredEventEpic: TypedEpic<typeof LobbyAction.joinLobbyCommand> = (actions$) => actions$.pipe(
  ofType(LobbyAction.enteredLobbyPageEvent),
  toPayload(),
  map(LobbyAction.joinLobbyCommand),
);

type JoinLobbyEpicDependencies = {
  joinLobby: JoinLobby;
};

const joinLobbyEpic = (
  deps: JoinLobbyEpicDependencies,
): TypedEpic<typeof LobbyAction.joinLobbyResolvedEvent | typeof LobbyAction.joinLobbyRejectedEvent> => (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.joinLobbyCommand),
  toPayload(),
  waitUntilAuthorized(state$),
  switchMap(([lobbyId, { userId, username }]) => from(deps.joinLobby({ userId, username }, lobbyId)).pipe(
    // `mapTo` really accepts `any` payload, therefore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    mapTo(LobbyAction.joinLobbyResolvedEvent(lobbyId)),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(LobbyAction.joinLobbyRejectedEvent(errorMessage));
    }),
  )),
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

export type LobbyEpicDependencies =
  & LeaveLobbyEpicDependencies
  & JoinLobbyEpicDependencies;

export const lobbyEpic = (deps: LobbyEpicDependencies) => typedCombineEpics<LobbyAction>(
  joinLobbyOnLobbyPageEnteredEventEpic,
  joinLobbyEpic(deps),
  leaveLobbyEpic(deps),
);
