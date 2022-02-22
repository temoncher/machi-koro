import { AnyAction } from 'redux';
import {
  filter,
  map,
  mapTo,
  Observable,
  switchMap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { LoginAction } from './login';
import { NavigationAction } from './navigation.actions';
import { RootAction } from './root.actions';
import { typedCombineEpics, TypedEpic } from './types/TypedEpic';
import { WebsocketAction } from './websocket';

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

type AuthorizeEpicDependencies = {
  authState$: Observable<{ username: string; userId: string } | undefined>;
};

const syncAuthStateOnAppStartedEvent = (
  deps: AuthorizeEpicDependencies,
): TypedEpic<typeof LoginAction.authorizeResolvedEvent | typeof LoginAction.authorizeRejectedEvent> => (actions$) => actions$.pipe(
  ofType(RootAction.appStartedEvent),
  switchMap(() => deps.authState$.pipe(
    map((user) => {
      if (!user) {
        return LoginAction.authorizeRejectedEvent('Signed out');
      }

      return LoginAction.authorizeResolvedEvent({
        type: 'guest',
        userId: user.userId,
        username: user.username,
      });
    }),
  )),
);

export type ConnectingEpicsDependencies = AuthorizeEpicDependencies;

export const connectingEpics = (deps: ConnectingEpicsDependencies) => typedCombineEpics<AnyAction>(
  dispatchAppStartedEventOnFirstRenderEpic,
  initializeWebsocketOnAppStartEventEpic,
  syncAuthStateOnAppStartedEvent(deps),
);
