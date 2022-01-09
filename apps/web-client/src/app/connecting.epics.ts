import { combineEpics } from 'redux-observable';
import {
  filter,
  ignoreElements,
  mapTo,
  tap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { GameAction } from './game';
import { LoadingAction } from './loading';
import { LoginAction } from './login';
import { NavigationAction } from './navigation.actions';
import { RootAction } from './root.actions';
import { RootState } from './root.state';
import { TypedEpic } from './types';
import { WebsocketAction } from './websocket';

const showLoaderOnAuthorizeCommandEpic: TypedEpic<typeof LoadingAction.setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(LoginAction.authorizeCommand),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(LoadingAction.setIsLoadingDocument(true)),
);

const hideLoaderOnAuthorizeResultEventEpic: TypedEpic<typeof LoadingAction.setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(LoginAction.authorizeResolvedEvent, LoginAction.authorizeRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(LoadingAction.setIsLoadingDocument(false)),
);

type CleanUpAuthTokenOnAuthorizeRejectedEventEpicDependencies = {
  cleanUpAuthToken: () => void;
};

const cleanUpAuthTokenOnAuthorizeRejectedEventEpic = (
  deps: CleanUpAuthTokenOnAuthorizeRejectedEventEpicDependencies,
): TypedEpic<never> => (actions$) => actions$.pipe(
  ofType(LoginAction.authorizeRejectedEvent),
  tap(deps.cleanUpAuthToken),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showLoaderOnRegisterGuestCommandEpic: TypedEpic<typeof LoadingAction.setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(LoginAction.registerGuestCommand),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(LoadingAction.setIsLoadingDocument(true)),
);

// TODO: deal with loading from concurrent requests
const hideLoaderOnRegisterGuestResultEventEpic: TypedEpic<typeof LoadingAction.setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(LoginAction.registerGuestResolvedEvent, LoginAction.registerGuestRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(LoadingAction.setIsLoadingDocument(false)),
);

type SetAuthTokenOnRegisterGuestResolvedEventEpicDependencies = {
  setAuthToken: (token: string) => void;
};

const setAuthTokenOnRegisterGuestResolvedEventEpic = (
  deps: SetAuthTokenOnRegisterGuestResolvedEventEpicDependencies,
): TypedEpic<never> => (actions$) => actions$.pipe(
  ofType(LoginAction.registerGuestResolvedEvent),
  toPayload(),
  tap(({ token }) => {
    deps.setAuthToken(token);
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showLoaderOnCreateGameCommandEpic: TypedEpic<typeof LoadingAction.setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(GameAction.createGameCommand),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(LoadingAction.setIsLoadingDocument(true)),
);

// TODO: deal with loading from concurrent requests
const hideLoaderOnRegistCreateGameEventEpic: TypedEpic<typeof LoadingAction.setIsLoadingDocument> = (actions$) => actions$.pipe(
  ofType(GameAction.createGameResolvedEvent, GameAction.createGameRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(LoadingAction.setIsLoadingDocument(false)),
);

const dispatchAppStartedEventOnFirstRenderEpic: TypedEpic<typeof RootAction.appStartedEvent> = (actions$) => actions$.pipe(
  ofType(NavigationAction.locationChangeEvent),
  toPayload(),
  filter((payload) => payload.isFirstRendering),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(RootAction.appStartedEvent()),
);

const initializeWebsocketOnAppStartEventEpic: TypedEpic<typeof WebsocketAction.initializeSocketCommand> = (actions$) => actions$.pipe(
  ofType(RootAction.appStartedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(WebsocketAction.initializeSocketCommand()),
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
  dispatchAppStartedEventOnFirstRenderEpic,
  initializeWebsocketOnAppStartEventEpic,
);
