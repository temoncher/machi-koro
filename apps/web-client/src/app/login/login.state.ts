import { AppHeaders } from '../types';
import { getAuthorizationHeader } from '../utils';

export type LoginState = {
  username: string;
  userId: string;
  headers: AppHeaders;
  authError: string | undefined;
};

export const initialLoginState: LoginState = {
  username: '',
  userId: '',
  headers: {
    Authorization: getAuthorizationHeader() ?? '',
    'Content-Type': 'application/json',
  },
  authError: undefined,
};
