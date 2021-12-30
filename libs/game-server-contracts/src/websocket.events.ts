import {
  UsersStatusesMap,
  GameContext,
  GameId,
  UserId,
} from './game.contracts';
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
  'GAME_STATE_UPDATED': (gameState: GameState | undefined) => void;
  'GAME_ERROR_ACCESS': () => void;
  'GAME_ERROR': (message: string) => void;
  'GAME_STARTED': (stateMachine: GameContext | undefined) => void;
  // Machine
  'DICE_ROLLED': (resultRollDice: number) => void;
  'BUILD_ESTABLISHMENT': (stateMachine: GameContext | undefined) => void;
  'BUILD_LANDMARK': (stateMachine: GameContext | undefined) => void;
  'PASS': (stateMachine: GameContext | undefined) => void;
  // Common
  'JOIN_ERROR': () => void;
  'SERVER_ERROR': () => void;
};

export type LobbyState = {
  hostId: string;
  users: User[];
};

export type GameState = {
  gameId: GameId;
  hostId: string;
  users: User[];
  usersStatusesMap: UsersStatusesMap;
};

export type ClientSentEventsMap = {
  joinLobby: (lobbyId: string) => void;
  leaveLobby: (lobbyId: string) => void;
  joinGame: (gameId: GameId) => void;
  leaveGame: (gameId: GameId) => void;
  startGame: (gameId: GameId) => void;
  rollDice: (userId: UserId) => void;
  pass: (userId: UserId) => void;
  buildEstablishment: (userId: UserId, establishment: string) => void;
  buildLandmark: (userId: UserId, landmark: string) => void;
};
