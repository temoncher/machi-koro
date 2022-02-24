import { GetNamespaceActionType } from '../utils/createActionsNamespace';
import { createEndpoint } from '../utils/createEndpoint';

import { RegisterGuest } from './login.api.types';

export const { RegisterGuestAction, registerGuestReducer, registerGuestEpic } = createEndpoint<RegisterGuest>()('REGISTER_GUEST');
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RegisterGuestAction = GetNamespaceActionType<typeof RegisterGuestAction>;
