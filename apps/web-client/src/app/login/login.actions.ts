import { RegisterGuestRequestBody } from '@machikoro/game-server-contracts';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setIsLoading } from '../loading';
import { RootApiType } from '../root.api.type';
import { RootState } from '../root.state';
import { getAuthorizationHeader } from '../utils';

import { LoginState } from './login.state';

export enum LoginActionTypes {
  SET_LOGIN_PARAMS = 'APP/SET_LOGIN_PARAMS',
  SET_AUTH_ERROR = 'APP/SET_AUTH_ERROR',
}

type SetLoginParamsPayload = Pick<LoginState, 'username' | 'userId' | 'headers'>;

type SetLoginParams = {
  type: LoginActionTypes.SET_LOGIN_PARAMS;
  payload: SetLoginParamsPayload;
};

type SetAuthError = {
  type: LoginActionTypes.SET_AUTH_ERROR;
  payload: string;

};

export type LoginAction = SetLoginParams | SetAuthError;

export const setLoginParams = (loginParams: SetLoginParamsPayload): LoginAction => ({
  type: LoginActionTypes.SET_LOGIN_PARAMS,
  payload: loginParams,
});

export const setAuthError = (authError: string): LoginAction => ({
  type: LoginActionTypes.SET_AUTH_ERROR,
  payload: authError,
});

export const getUserData = () => async (
  dispatch: ThunkDispatch<unknown, unknown, Action>,
  getState: () => RootState,
  rootApi: RootApiType.RootApi,
): Promise<void> => {
  try {
    dispatch(setIsLoading(true));

    const userData = await rootApi.loginApi.sendAuthMeRequest();

    const loginParams: SetLoginParamsPayload = {
      username: userData.username,
      userId: userData.userId,
      headers: {
        Authorization: getAuthorizationHeader() ?? '',
        'Content-Type': 'application/json',
      },
    };

    dispatch(setLoginParams(loginParams));
  } catch (error: unknown) {
    localStorage.removeItem('token');

    if (error instanceof Error) {
      dispatch(setAuthError(error.message));

      return;
    }

    throw error;
  } finally {
    dispatch(setIsLoading(false));
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const registerGuest = (userData: RegisterGuestRequestBody) => async (
  dispatch: ThunkDispatch<unknown, unknown, Action>,
  getState: () => RootState,
  rootApi: RootApiType.RootApi,
): Promise<void> => {
  dispatch(setIsLoading(true));

  const registerUserDataResponse = await rootApi.loginApi.sendRegisterGuestRequest(userData);

  const loginParams: SetLoginParamsPayload = {
    username: registerUserDataResponse.username,
    userId: registerUserDataResponse.userId,
    headers:
    {
      Authorization: `Bearer ${registerUserDataResponse.token || ''}`,
      'Content-Type': 'application/json',
    },
  };

  localStorage.setItem('token', registerUserDataResponse.token || '');

  dispatch(setLoginParams(loginParams));
  dispatch(setIsLoading(false));
};

export const loginActions = {
  setLoginParams,
  registerGuest,
  getUserData,
};
