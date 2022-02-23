import { createEndpoint } from '../utils/createEndpoint';

import { JoinLobby } from './lobbies.api.types';

export const { JoinLobbyAction, joinLobbyEpic, joinLobbyReducer } = createEndpoint<JoinLobby>()('JOIN_LOBBY');
