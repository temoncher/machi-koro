import { User } from '@machikoro/game-server-contracts';
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

const dispatchAppStartedEventOnFirstRenderEpic: TypedEpic<typeof RootAction.appStartedEvent> = (actions$) => actions$.pipe(
  ofType(NavigationAction.locationChangeEvent),
  toPayload(),
  filter((payload) => payload.isFirstRendering),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(RootAction.appStartedEvent()),
);

type AuthorizeEpicDependencies = {
  authState$: Observable<User | undefined>;
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

      return LoginAction.authorizeResolvedEvent(user);
    }),
  )),
);

export type ConnectingEpicsDependencies = AuthorizeEpicDependencies;

export const connectingEpics = (deps: ConnectingEpicsDependencies) => typedCombineEpics<AnyAction>(
  dispatchAppStartedEventOnFirstRenderEpic,
  syncAuthStateOnAppStartedEvent(deps),
);
