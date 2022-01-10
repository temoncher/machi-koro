import { UserId } from '@machikoro/game-server-contracts';

import { LoginStatus } from '../types/LoginStatus';

export type LoginState = {
  username: string | undefined;
  userId: UserId | undefined;
  status: LoginStatus;
};

export const initialLoginState: LoginState = {
  username: undefined,
  userId: undefined,
  status: LoginStatus.PENDING,
};
