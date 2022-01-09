import { UserId } from './user.model';

export type LobbyId = string;

export type CreateLobbyResponse = {
  lobbyId: LobbyId;
};

export type CreateLobbyRequestBody = {
  hostId: UserId;
};

export type Lobby = {
  hostId: UserId;
  users: UserId[];
};
