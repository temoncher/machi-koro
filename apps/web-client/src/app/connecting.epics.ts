import { combineEpics } from 'redux-observable';
import { ignoreElements, mapTo, tap } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { createGameCommand, createGameRejectedEvent, createGameResolvedEvent } from './game';
import { setIsLoadingDocument } from './loading';
import {
  authorizeCommand,
  authorizeRejectedEvent,
  authorizeResolvedEvent,
  registerGuestCommand,
  registerGuestRejectedEvent,
  registerGuestResolvedEvent,
} from './login';
import { RootAction } from './root.actions';
import { RootState } from './root.state';
import { TypedEpic } from './types';

const showLoaderOnAuthorizeCommandEpic: TypedEpic<typeof setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(authorizeCommand),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(setIsLoadingDocument(true)),
);

const hideLoaderOnAuthorizeResultEventEpic: TypedEpic<typeof setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(authorizeResolvedEvent, authorizeRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(setIsLoadingDocument(false)),
);

type CleanUpAuthTokenOnAuthorizeRejectedEventEpicDependencies = {
  cleanUpAuthToken: () => void;
};

const cleanUpAuthTokenOnAuthorizeRejectedEventEpic = (
  deps: CleanUpAuthTokenOnAuthorizeRejectedEventEpicDependencies,
): TypedEpic<never> => (actions$) => actions$.pipe(
  ofType(authorizeRejectedEvent),
  tap(deps.cleanUpAuthToken),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showLoaderOnRegisterGuestCommandEpic: TypedEpic<typeof setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(registerGuestCommand),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(setIsLoadingDocument(true)),
);

// TODO: deal with loading from concurrent requests
const hideLoaderOnRegisterGuestResultEventEpic: TypedEpic<typeof setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(registerGuestResolvedEvent, registerGuestRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(setIsLoadingDocument(false)),
);

type SetAuthTokenOnRegisterGuestResolvedEventEpicDependencies = {
  setAuthToken: (token: string) => void;
};

const setAuthTokenOnRegisterGuestResolvedEventEpic = (
  deps: SetAuthTokenOnRegisterGuestResolvedEventEpicDependencies,
): TypedEpic<never> => (actions$) => actions$.pipe(
  ofType(registerGuestResolvedEvent),
  toPayload(),
  tap(({ token }) => {
    deps.setAuthToken(token);
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showLoaderOnCreateGameCommandEpic: TypedEpic<typeof setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(createGameCommand),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(setIsLoadingDocument(true)),
);

// TODO: deal with loading from concurrent requests
const hideLoaderOnRegistCreateGameEventEpic: TypedEpic<typeof setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(createGameResolvedEvent, createGameRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(setIsLoadingDocument(false)),
);

export type ConnectingEpicsDependencies =
  & CleanUpAuthTokenOnAuthorizeRejectedEventEpicDependencies
  & SetAuthTokenOnRegisterGuestResolvedEventEpicDependencies;

export const connectingEpics = (deps: ConnectingEpicsDependencies) => combineEpics<RootAction, RootAction, RootState, unknown>(
  showLoaderOnAuthorizeCommandEpic,
  hideLoaderOnAuthorizeResultEventEpic,
  cleanUpAuthTokenOnAuthorizeRejectedEventEpic(deps),
  showLoaderOnRegisterGuestCommandEpic,
  hideLoaderOnRegisterGuestResultEventEpic,
  setAuthTokenOnRegisterGuestResolvedEventEpic(deps),
  showLoaderOnCreateGameCommandEpic,
  hideLoaderOnRegistCreateGameEventEpic,
);
