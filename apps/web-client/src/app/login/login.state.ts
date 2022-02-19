import { UserId } from '@machikoro/game-server-contracts';

import { LoginStatus } from '../types/LoginStatus';

export type LoginState = {
  status: LoginStatus.PENDING;
  username: undefined;
  userId: undefined;
} | {
  status: LoginStatus.NOT_AUTHORIZED;
  username: undefined;
  userId: undefined;
} | {
  status: LoginStatus.AUTHORIZED;
  username: string;
  userId: UserId;
};

export const initialLoginState: LoginState = {
  username: undefined,
  userId: undefined,
  status: LoginStatus.PENDING,
};
