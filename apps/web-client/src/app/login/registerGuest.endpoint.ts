import { createEndpoint } from '../utils/createEndpoint';

import { RegisterGuest } from './login.api.types';

export const { RegisterGuestAction, registerGuestReducer, registerGuestEpic } = createEndpoint<RegisterGuest>()('REGISTER_GUEST');
