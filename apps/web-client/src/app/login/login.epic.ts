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
import { RegisterGuest } from './login.api.types';

type RegisterGuestEpicDependencies = {
  registerGuest: RegisterGuest;
};

const registerGuestEpic = (
  deps: RegisterGuestEpicDependencies,
): TypedEpic<typeof LoginAction.registerGuestResolvedEvent | typeof LoginAction.registerGuestRejectedEvent> => (actions$) => actions$.pipe(
  ofType(LoginAction.registerGuestCommand),
  toPayload(),
  switchMap((username) => from(deps.registerGuest(username)).pipe(
    map(LoginAction.registerGuestResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(LoginAction.registerGuestRejectedEvent(errorMessage));
    }),
  )),
);

export type LoginEpicDependencies = RegisterGuestEpicDependencies;

export const loginEpic = (deps: LoginEpicDependencies) => typedCombineEpics<LoginAction>(
  registerGuestEpic(deps),
);
