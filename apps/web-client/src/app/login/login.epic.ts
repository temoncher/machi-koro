import { AnyAction } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  catchError,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { TypedEpic } from '../types';

import {
  authorizeCommand,
  authorizeRejectedEvent,
  authorizeResolvedEvent,
  registerGuestCommand,
  registerGuestRejectedEvent,
  registerGuestResolvedEvent,
  AuthorizeResolvedPayload,
  RegisterGuestResolvedPayload,
  LoginAction,
} from './login.actions';

type AuthorizeEpicDependencies = {
  authorize: () => Promise<AuthorizeResolvedPayload>;
};

const authorizeEpic = (
  deps: AuthorizeEpicDependencies,
): TypedEpic<typeof authorizeResolvedEvent | typeof authorizeRejectedEvent> => (actions$) => actions$.pipe(
  ofType(authorizeCommand),
  switchMap(() => from(deps.authorize()).pipe(
    map(authorizeResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(authorizeRejectedEvent(errorMessage));
    }),
  )),
);

type RegisterGuestEpicDependencies = {
  registerGuest: (registerGuestRequestBody: { username: string; type: 'guest' }) => Promise<RegisterGuestResolvedPayload>;
};

const registerGuestEpic = (
  deps: RegisterGuestEpicDependencies,
): TypedEpic<typeof registerGuestResolvedEvent | typeof registerGuestRejectedEvent> => (actions$) => actions$.pipe(
  ofType(registerGuestCommand),
  toPayload(),
  switchMap((username) => from(deps.registerGuest({ username, type: 'guest' })).pipe(
    map(registerGuestResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(registerGuestRejectedEvent(errorMessage));
    }),
  )),
);

export type LoginEpicDependencies =
  & AuthorizeEpicDependencies
  & RegisterGuestEpicDependencies;

export const loginEpic = (deps: LoginEpicDependencies) => combineEpics<AnyAction, LoginAction, unknown, unknown>(
  authorizeEpic(deps),
  registerGuestEpic(deps),
);
