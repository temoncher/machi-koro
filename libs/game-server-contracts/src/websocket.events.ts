import { Game } from './game.contracts';
import { User } from './user.model';

/* eslint-disable @typescript-eslint/naming-convention */
export type ServerSentEventsMap = {
  // Lobby
  'LOBBY_USER_JOINED': (user: User) => void;
  'LOBBY_USER_LEFT': (user: User) => void;
  'LOBBY_STATE_UPDATED': (lobbyState: LobbyState | undefined) => void;
  'LOBBY_ERROR_MAX_USERS': () => void;
  // Game
  'GAME_USER_JOINED': (userId: string) => void;
  'GAME_USER_LEFT': (userId: string) => void;
  'GAME_STATE_UPDATED': (gameState: Game | undefined) => void;
  'GAME_ERROR_ACCESS': () => void;
  'GAME_STARTED': (stateMachine: any) => void;
  // Machine
  'DICE_ROLLED': (resultRollDice: number) => void;
  // Common
  'JOIN_ERROR': () => void;
  'SERVER_ERROR': () => void;
};

export type LobbyState = {
  hostId: string;
  users: User[];
};

export type ClientSentEventsMap = {
  joinLobby: (lobbyId: string) => void;
  leaveLobby: (lobbyId: string) => void;
  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  startGame: (gameId: string) => void;
  rollDice: (userId: string) => void;
};
