import { User } from './user.model';

/* eslint-disable @typescript-eslint/naming-convention */
export type ServerSentEventsMap = {
  // Lobby
  'LOBBY_USER_JOINED': (user: User) => void;
  'LOBBY_USER_LEAVE': (user: User) => void;
  'LOBBY_LEAVE': () => void;
  'LOBBY_STATE_UPDATED': (lobbyState: LobbyState | undefined) => void;
  'LOBBY_ERROR_MAX_USERS': () => void;
  // Common
  'JOINED_ERROR': () => void;
  'SERVER_ERROR': () => void;
};

export type LobbyState = {
  hostId: string;
  users: User[];
};

export type ClientSentEventsMap = {
  joinLobby: (lobbyId: string) => void;
  leaveLobby: (lobbyId: string) => void;
};
