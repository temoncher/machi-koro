import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setIsLoading } from '../loading';
import { RootApiType } from '../root.api.type';
import { RootState } from '../root.state';
import { getAuthorizationHeader } from '../utils';

import { LoginApiType } from './login.api.type';
import { LoginState } from './login.state';

export enum LoginActionTypes {
  SET_LOGIN_PARAMS = 'APP/SET_LOGIN_PARAMS',
}

type SetLoginParams = {
  type: LoginActionTypes.SET_LOGIN_PARAMS;
  payload: LoginState;
};

export type LoginAction = SetLoginParams;

export const setLoginParams = (loginParams: LoginState): LoginAction => ({
  type: LoginActionTypes.SET_LOGIN_PARAMS,
  payload: loginParams,
});

export const getUserData = () => async (
  dispatch: ThunkDispatch<unknown, unknown, Action>,
  getState: () => RootState,
  rootApi: RootApiType.RootApi,
): Promise<void> => {
  dispatch(setIsLoading(true));

  const mockUserData = {
    username: '',
    id: '',
  };

  const userData = await rootApi.loginApi.fetchUserData()
    .catch(() => mockUserData);

  if (userData.username === '') {
    localStorage.removeItem('token');
  }

  const loginParams: LoginState = {
    username: userData.username,
    userId: userData.id,
    headers: {
      Authorization: getAuthorizationHeader() ?? '',
      'Content-Type': 'application/json',
    },
  };

  dispatch(setLoginParams(loginParams));
  dispatch(setIsLoading(false));
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const registerGuest = (userData: LoginApiType.AuthRequestBody) => async (
  dispatch: ThunkDispatch<unknown, unknown, Action>,
  getState: () => RootState,
  rootApi: RootApiType.RootApi,
): Promise<void> => {
  dispatch(setIsLoading(true));

  const mockUserData = {
    username: '',
    id: '',
    token: '',
  };

  const registerUserDataResponse = await rootApi.loginApi.fetchRegisterGuest(userData)
    .catch(() => mockUserData);

  const loginParams: LoginState = {
    username: registerUserDataResponse.username,
    userId: registerUserDataResponse.id,
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
