import { on, reducer } from 'ts-action';

import { LoginStatus } from '../types/LoginStatus';

import { LoginAction } from './login.actions';
import { initialLoginState } from './login.state';

export const loginReducer = reducer(
  initialLoginState,
  on(LoginAction.authorizeResolvedEvent, LoginAction.registerGuestResolvedEvent, (state, { payload }) => ({
    ...state,
    username: payload.username,
    userId: payload.userId,
    status: LoginStatus.AUTHORIZED,
  })),
  on(LoginAction.authorizeRejectedEvent, (state) => ({
    ...state,
    status: LoginStatus.NOT_AUTHORIZED,
  })),
);
