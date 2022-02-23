import { createEndpoint } from '../utils/createEndpoint';

import { CreateLobby } from './home.api.types';

export const { CreateLobbyAction, createLobbyEpic, createLobbyReducer } = createEndpoint<CreateLobby>()('CREATE_LOBBY');
