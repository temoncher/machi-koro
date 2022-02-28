import {
  Game,
  LobbyId,
  User,
  UserId,
} from '@machikoro/game-server-contracts';

export type CreateGame = (fromLobby: LobbyId) => Promise<Game>;
export type LeaveLobby = (userId: UserId, lobbyId: LobbyId) => Promise<void>;
export type JoinLobby = (user: User, lobbyId: LobbyId) => Promise<LobbyId>;
