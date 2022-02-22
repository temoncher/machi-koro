import {
  catchError,
  from,
  map,
  mapTo,
  of,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

import { CreateLobby, GetLobbyState$, JoinLobby } from './lobbies.api.types';
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
  withLatestFrom(state$),
  // TODO: add error handling (if userId is undefined)?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, state]) => state.loginReducer.userId as string),
  // TODO: replace hardcoded capacity with user defined value
  switchMap((hostId) => from(deps.createLobby(hostId, 4)).pipe(
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

type UpdateLobbyStateOnJoinLobbyResolvedEvent = {
  getLobbyState$: GetLobbyState$;
};

const updateLobbyStateOnJoinLobbyResolvedEvent = (
  deps: UpdateLobbyStateOnJoinLobbyResolvedEvent,
): TypedEpic<typeof LobbyAction.setLobbyDocument> => (actions$) => actions$.pipe(
  ofType(LobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => deps.getLobbyState$(lobbyId).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.currentUserLeftLobbyEvent))),
    map((newLobbyState) => LobbyAction.setLobbyDocument(newLobbyState)),
  )),
);

type JoinLobbyDependencies = {
  joinLobby: JoinLobby;
};

const joinLobby = (
  deps: JoinLobbyDependencies,
): TypedEpic<typeof LobbyAction.joinLobbyResolvedEvent | typeof LobbyAction.joinLobbyRejectedEvent> => (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.joinLobbyCommand),
  toPayload(),
  withLatestFrom(state$),
  // TODO: add error handling (if userId is undefined)?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([lobbyId, state]) => [lobbyId, state.loginReducer.userId!, state.loginReducer.username!] as const),
  switchMap(([lobbyId, userId, username]) => from(deps.joinLobby({ type: 'guest', userId, username }, lobbyId)).pipe(
    // `mapTo` really accepts `any` payload, therefore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    mapTo(LobbyAction.joinLobbyResolvedEvent(lobbyId)),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(LobbyAction.joinLobbyRejectedEvent(errorMessage));
    }),
  )),
);

export type LobbyEpicDependencies =
  & JoinLobbyDependencies
  & CreateLobbyEpicDependencies
  & UpdateLobbyStateOnJoinLobbyResolvedEvent;

export const lobbyEpic = (deps: LobbyEpicDependencies) => typedCombineEpics<LobbyAction>(
  createLobbyEpic(deps),
  showCreateLobbyLoaderOnCreateLobbyCommandEpic,
  hideCreateLobbyLoaderOnCreateLobbyResultEventEpic,
  joinLobbyOnLobbyPageEnteredEventEpic,
  updateLobbyStateOnJoinLobbyResolvedEvent(deps),
  joinLobby(deps),
);
