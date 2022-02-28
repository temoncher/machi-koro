import { GameId } from './game.contracts';
import { UserId, User } from './user.model';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type LobbyId = string & { readonly LOBBY_ID: unique symbol };

export type CreateLobbyResponse = {
  lobbyId: LobbyId;
};

export type CreateLobbyRequestBody = {
  hostId: UserId;
};

export enum ReadyState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
}

export type Lobby = {
  lobbyId: LobbyId;
  hostId: UserId;
  capacity: number;

  gameId?: GameId;
  users?: Record<UserId, User>;
  readyStates?: Record<UserId, ReadyState>;
};
