import { AuthMeResponse, RegisterGuestRequestBody, RegisterGuestResponse } from '@machikoro/game-server-contracts';
import {
  catchError,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

import { LoginAction } from './login.actions';

type AuthorizeEpicDependencies = {
  authorize: () => Promise<AuthMeResponse>;
};

const authorizeEpic = (
  deps: AuthorizeEpicDependencies,
): TypedEpic<typeof LoginAction.authorizeResolvedEvent | typeof LoginAction.authorizeRejectedEvent> => (actions$) => actions$.pipe(
  ofType(LoginAction.authorizeCommand),
  switchMap(() => from(deps.authorize()).pipe(
    map(LoginAction.authorizeResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(LoginAction.authorizeRejectedEvent(errorMessage));
    }),
  )),
);

type RegisterGuestEpicDependencies = {
  registerGuest: (registerGuestRequestBody: RegisterGuestRequestBody) => Promise<RegisterGuestResponse>;
};

const registerGuestEpic = (
  deps: RegisterGuestEpicDependencies,
): TypedEpic<typeof LoginAction.registerGuestResolvedEvent | typeof LoginAction.registerGuestRejectedEvent> => (actions$) => actions$.pipe(
  ofType(LoginAction.registerGuestCommand),
  toPayload(),
  switchMap((username) => from(deps.registerGuest({ username, type: 'guest' })).pipe(
    map(LoginAction.registerGuestResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(LoginAction.registerGuestRejectedEvent(errorMessage));
    }),
  )),
);

export type LoginEpicDependencies =
  & AuthorizeEpicDependencies
  & RegisterGuestEpicDependencies;

export const loginEpic = (deps: LoginEpicDependencies) => typedCombineEpics<LoginAction>(
  authorizeEpic(deps),
  registerGuestEpic(deps),
);
