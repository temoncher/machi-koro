import { on, reducer } from 'ts-action';

import { LoginStatus } from '../types/LoginStatus';

import { LoginAction } from './login.actions';
import { initialLoginState } from './login.state';
import { RegisterGuestAction } from './registerGuest.endpoint';

export const loginReducer = reducer(
  initialLoginState,
  on(LoginAction.authorizeResolvedEvent, RegisterGuestAction.registerGuestResolvedEvent, (state, { payload }) => ({
    ...state,
    username: payload.username,
    userId: payload.userId,
    status: LoginStatus.AUTHORIZED,
  } as const)),
  on(LoginAction.authorizeRejectedEvent, (state) => ({
    ...state,
    username: undefined,
    userId: undefined,
    status: LoginStatus.NOT_AUTHORIZED,
  } as const)),
);
