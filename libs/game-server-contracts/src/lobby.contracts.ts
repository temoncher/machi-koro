import { UserId, User } from './user.model';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type LobbyId = string & { readonly LOBBY_ID: unique symbol };

export type CreateLobbyResponse = {
  lobbyId: LobbyId;
};

export type CreateLobbyRequestBody = {
  hostId: UserId;
};

export type Lobby = {
  lobbyId: LobbyId;
  hostId: UserId;
  capacity: number;

  users?: Record<UserId, User>;
};
