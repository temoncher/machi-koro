import { LoginStatus } from '../types';

export type LoginState = {
  username: string;
  userId: string;
  status: LoginStatus;
};

export const initialLoginState: LoginState = {
  username: '',
  userId: '',
  status: LoginStatus.PENDING,
};
