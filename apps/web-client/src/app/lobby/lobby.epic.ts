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
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { TypedEpic } from '../types';

import {
  setIsCreateLobbyLoadingDocument,
  createLobbyCommand,
  createLobbyResolvedEvent,
  createLobbyRejectedEvent,
  LobbyAction,
} from './lobby.actions';

type CreateLobbyEpicDependencies = {
  createLobby: (requestBody: CreateLobbyRequestBody) => Promise<CreateLobbyResponse>;
};

const createLobbyEpic = (
  deps: CreateLobbyEpicDependencies,
): TypedEpic<typeof createLobbyResolvedEvent | typeof createLobbyRejectedEvent> => (actions$) => actions$.pipe(
  ofType(createLobbyCommand),
  toPayload(),
  switchMap((hostId) => from(deps.createLobby(hostId)).pipe(
    map(createLobbyResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(createLobbyRejectedEvent(errorMessage));
    }),
  )),
);

const showCreateLobbyLoaderOnCreateLobbyCommandEpic: TypedEpic<typeof setIsCreateLobbyLoadingDocument> = (actions$) => actions$.pipe(
  ofType(createLobbyCommand),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(setIsCreateLobbyLoadingDocument(true)),
);

const hideCreateLobbyLoaderOnCreateLobbyResultEventEpic: TypedEpic<typeof setIsCreateLobbyLoadingDocument> = (actions$) => actions$.pipe(
  ofType(createLobbyResolvedEvent, createLobbyRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(setIsCreateLobbyLoadingDocument(false)),
);

export type LobbyEpicDependencies = CreateLobbyEpicDependencies;

export const lobbyEpic = (deps: LobbyEpicDependencies) => combineEpics<AnyAction, LobbyAction, unknown, unknown>(
  createLobbyEpic(deps),
  showCreateLobbyLoaderOnCreateLobbyCommandEpic,
  hideCreateLobbyLoaderOnCreateLobbyResultEventEpic,
);
