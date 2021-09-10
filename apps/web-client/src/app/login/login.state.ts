import { getAuthorizationHeader } from '../utils/getAuthorizationHeader';

import { LoginApi } from './login.api';

export type LoginState = {
  username: string;
  userId: string;
  headers: LoginApi.HeadersType;
};

export const initialLoginState: LoginState = {
  username: '',
  userId: '',
  headers: {
    Authorization: getAuthorizationHeader() ?? '',
    'Content-Type': 'application/json',
  },
};
