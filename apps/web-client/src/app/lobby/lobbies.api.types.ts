import {
  Game,
  Lobby,
  LobbyId,
  User,
  UserId,
} from '@machikoro/game-server-contracts';

export type CreateGame = (lobby: Lobby, hostId: UserId) => Promise<Game>;
export type LeaveLobby = (userId: UserId, lobbyId: LobbyId) => Promise<void>;
export type JoinLobby = (user: User, lobbyId: LobbyId) => Promise<LobbyId>;
