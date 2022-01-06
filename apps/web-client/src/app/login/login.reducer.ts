import { on, reducer } from 'ts-action';

import { LoginStatus } from '../types';

import { authorizeResolvedEvent, authorizeRejectedEvent, registerGuestResolvedEvent } from './login.actions';
import { initialLoginState } from './login.state';

export const loginReducer = reducer(
  initialLoginState,
  on(authorizeResolvedEvent, registerGuestResolvedEvent, (state, { payload }) => ({
    ...state,
    username: payload.username,
    userId: payload.userId,
    status: LoginStatus.AUTHORIZED,
  })),
  on(authorizeRejectedEvent, (state) => ({
    ...state,
    status: LoginStatus.NOT_AUTHORIZED,
  })),
);
