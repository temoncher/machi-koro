import { AnyAction } from 'redux';
import {
  filter,
  ignoreElements,
  mapTo,
  tap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { LoginAction } from './login';
import { NavigationAction } from './navigation.actions';
import { RootAction } from './root.actions';
import { typedCombineEpics, TypedEpic } from './types/TypedEpic';
import { WebsocketAction } from './websocket';

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

export const connectingEpics = (deps: ConnectingEpicsDependencies) => typedCombineEpics<AnyAction>(
  cleanUpAuthTokenOnAuthorizeRejectedEventEpic(deps),
  setAuthTokenOnRegisterGuestResolvedEventEpic(deps),
  dispatchAppStartedEventOnFirstRenderEpic,
  initializeWebsocketOnAppStartEventEpic,
);
