import { UserId, User } from './user.model';

export type LobbyId = string;

export type CreateLobbyResponse = {
  lobbyId: LobbyId;
};

export type CreateLobbyRequestBody = {
  hostId: UserId;
};

export type Lobby = {
  lobbyId: LobbyId;
  hostId: UserId;
  users: Record<UserId, User>;
  capacity: number;
};
