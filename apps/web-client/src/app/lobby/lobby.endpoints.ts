import { GetNamespaceActionType } from '../utils/createActionsNamespace';
import { createEndpoint } from '../utils/createEndpoint';

import { JoinLobby, LeaveLobby, CreateGame } from './lobbies.api.types';

export const { LeaveLobbyAction, leaveLobbyEpic, leaveLobbyReducer } = createEndpoint<LeaveLobby>()('LEAVE_LOBBY');
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LeaveLobbyAction = GetNamespaceActionType<typeof LeaveLobbyAction>;

export const { CreateGameAction, createGameEpic, createGameReducer } = createEndpoint<CreateGame>()('CREATE_GAME');
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CreateGameAction = GetNamespaceActionType<typeof CreateGameAction>;

export const { JoinLobbyAction, joinLobbyEpic, joinLobbyReducer } = createEndpoint<JoinLobby>()('JOIN_LOBBY');
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type JoinLobbyAction = GetNamespaceActionType<typeof JoinLobbyAction>;
