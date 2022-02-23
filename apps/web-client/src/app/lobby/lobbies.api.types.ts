import {
  Lobby,
  LobbyId,
  User,
  UserId,
} from '@machikoro/game-server-contracts';

export type LeaveLobby = (userId: UserId, lobbyId: LobbyId) => Promise<void>;
export type JoinLobby = (user: User, lobbyId: LobbyId) => Promise<void>;
export type GetLobby = (lobbyId: LobbyId) => Promise<Lobby | undefined>;
