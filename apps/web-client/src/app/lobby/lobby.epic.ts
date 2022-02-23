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

import {
  CreateLobby,
  JoinLobby,
  LeaveLobby,
} from './lobbies.api.types';
import { LobbyAction } from './lobby.actions';

type CreateLobbyEpicDependencies = {
  createLobby: CreateLobby;
};

const createLobbyEpic = (
  deps: CreateLobbyEpicDependencies,
): TypedEpic<typeof LobbyAction.createLobbyResolvedEvent | typeof LobbyAction.createLobbyRejectedEvent> => (
  actions$,
  state$,
) => actions$.pipe(
  ofType(LobbyAction.createLobbyCommand),
  waitUntilAuthorized(state$),
  // TODO: replace hardcoded capacity with user defined value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switchMap(([action, { userId }]) => from(deps.createLobby(userId, 4)).pipe(
    map(LobbyAction.createLobbyResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(LobbyAction.createLobbyRejectedEvent(errorMessage));
    }),
  )),
);

const showCreateLobbyLoaderOnCreateLobbyCommandEpic: TypedEpic<typeof LobbyAction.setIsCreateLobbyLoadingDocument> = (
  actions$,
) => actions$.pipe(
  ofType(LobbyAction.createLobbyCommand),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(LobbyAction.setIsCreateLobbyLoadingDocument(true)),
);

const hideCreateLobbyLoaderOnCreateLobbyResultEventEpic: TypedEpic<typeof LobbyAction.setIsCreateLobbyLoadingDocument> = (
  actions$,
) => actions$.pipe(
  ofType(LobbyAction.createLobbyResolvedEvent, LobbyAction.createLobbyRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(LobbyAction.setIsCreateLobbyLoadingDocument(false)),
);

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
  & JoinLobbyEpicDependencies
  & CreateLobbyEpicDependencies;

export const lobbyEpic = (deps: LobbyEpicDependencies) => typedCombineEpics<LobbyAction>(
  createLobbyEpic(deps),
  showCreateLobbyLoaderOnCreateLobbyCommandEpic,
  hideCreateLobbyLoaderOnCreateLobbyResultEventEpic,
  joinLobbyOnLobbyPageEnteredEventEpic,
  joinLobbyEpic(deps),
  leaveLobbyEpic(deps),
);
