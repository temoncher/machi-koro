import { AuthMeResponse } from '@machikoro/game-server-contracts';
import { payload } from 'ts-action';

import { createActionsNamespace, GetNamespaceActionType } from '../utils/createActionsNamespace';

const loginActionTypeToPayloadMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  '[EVENT] APP/AUTH/AUTHORIZE_RESOLVED': payload<AuthMeResponse>(),
  '[EVENT] APP/AUTH/AUTHORIZE_REJECTED': payload<string>(),
  '[COMMAND] APP/AUTH/REGISTER_GUEST': payload<string>(),
  '[EVENT] APP/AUTH/REGISTER_GUEST_RESOLVED': payload<{ userId: string; username: string }>(),
  '[EVENT] APP/AUTH/REGISTER_GUEST_REJECTED': payload<string>(),
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const LoginAction = createActionsNamespace(loginActionTypeToPayloadMap);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LoginAction = GetNamespaceActionType<typeof LoginAction>;

export const loginActions = {
  registerGuestCommand: LoginAction.registerGuestCommand,
};
