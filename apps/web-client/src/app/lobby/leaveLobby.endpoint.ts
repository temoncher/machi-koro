import { createEndpoint } from '../utils/createEndpoint';

import { LeaveLobby } from './lobbies.api.types';

export const { LeaveLobbyAction, leaveLobbyEpic, leaveLobbyReducer } = createEndpoint<LeaveLobby>()('LEAVE_LOBBY');
