import { CreateLobbyRequestBody, CreateLobbyResponse } from '@machikoro/game-server-contracts';
import { AnyAction } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  catchError,
  from,
  map,
  mapTo,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { RootState } from '../root.state';
import { TypedEpic } from '../types';

import { LobbyAction } from './lobby.actions';

type CreateLobbyEpicDependencies = {
  createLobby: (requestBody: CreateLobbyRequestBody) => Promise<CreateLobbyResponse>;
};

const createLobbyEpic = (
  deps: CreateLobbyEpicDependencies,
): TypedEpic<typeof LobbyAction.createLobbyResolvedEvent | typeof LobbyAction.createLobbyRejectedEvent, RootState> => (
  actions$,
  state$,
) => actions$.pipe(
  ofType(LobbyAction.createLobbyCommand),
  withLatestFrom(state$),
  // TODO: add error handling (if userId is undefined)?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, state]) => state.loginReducer.userId as string),
  switchMap((hostId) => from(deps.createLobby({ hostId })).pipe(
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

export type LobbyEpicDependencies = CreateLobbyEpicDependencies;

export const lobbyEpic = (deps: LobbyEpicDependencies) => combineEpics<AnyAction, LobbyAction, RootState, unknown>(
  createLobbyEpic(deps),
  showCreateLobbyLoaderOnCreateLobbyCommandEpic,
  hideCreateLobbyLoaderOnCreateLobbyResultEventEpic,
  joinLobbyOnLobbyPageEnteredEventEpic,
);
