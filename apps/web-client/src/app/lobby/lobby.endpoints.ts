import { createEndpoint } from '../utils/createEndpoint';

import { JoinLobby, LeaveLobby, CreateGame } from './lobbies.api.types';

export const { LeaveLobbyAction, leaveLobbyEpic, leaveLobbyReducer } = createEndpoint<LeaveLobby>()('LEAVE_LOBBY');

export const { CreateGameAction, createGameEpic, createGameReducer } = createEndpoint<CreateGame>()('CREATE_GAME');

export const { JoinLobbyAction, joinLobbyEpic, joinLobbyReducer } = createEndpoint<JoinLobby>()('JOIN_LOBBY');
