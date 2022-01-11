import {
  GameContext,
  GameId,
  EstablishmentId,
  LandmarkId,
  Game,
} from './game.contracts';
import { LobbyId } from './lobby.contracts';
import { User, UserId } from './user.model';

type AnyFunction = (...args: any[]) => any;

type GetActionTypes<M extends ClientSentEventsMap | ServerSentEventsMap> = {
  [T in keyof M]: {
    type: T;
    payload: M[T] extends AnyFunction ? Parameters<M[T]>[0] : never;
  }
};

export type ServerSentEventsMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  // Lobby
  LOBBY_USER_JOINED: (payload: { user: User; lobbyId: LobbyId }) => void;
  LOBBY_JOINED_SUCCESSFULLY: (lobbyId: LobbyId) => void;
  LOBBY_HOST_CHANGED: (payload: { newHost: User; lobbyId: LobbyId }) => void;
  LOBBY_JOIN_ERROR: (message: string) => void;
  LOBBY_USER_LEFT: (payload: { user: User; lobbyId: LobbyId }) => void;
  LOBBY_LEFT_SUCCESSFULLY: (lobbyId: LobbyId) => void;
  LOBBY_LEAVE_ERROR: () => void;
  LOBBY_STATE_UPDATED: (lobbyState: PopulatedLobbyState | undefined) => void;
  LOBBY_ERROR_MAX_USERS: () => void;
  LOBBY_GAME_CREATED: (gameId: GameId) => void;
  // Game
  GAME_USER_JOINED: (userId: UserId) => void;
  GAME_JOIN_ERROR: () => void;
  GAME_USER_LEFT: (userId: UserId) => void;
  GAME_LEAVE_ERROR: () => void;
  GAME_STATE_UPDATED: (gameState: Game | undefined) => void;
  GAME_ERROR_ACCESS: () => void;
  GAME_ERROR: (message: string) => void;
  GAME_STARTED: (stateMachine: GameContext | undefined) => void;
  // Machine
  DICE_ROLLED: (resultRollDice: number) => void;
  BUILD_ESTABLISHMENT: (stateMachine: GameContext | undefined) => void;
  BUILD_LANDMARK: (stateMachine: GameContext | undefined) => void;
  PASS: (stateMachine: GameContext | undefined) => void;
  // Common
  SERVER_ERROR: () => void;
  /* eslint-enable @typescript-eslint/naming-convention */
};

export type ServerSentActionTypes = GetActionTypes<ServerSentEventsMap>;

export type PopulatedLobbyState = {
  hostId: UserId;
  users: User[];
};

export type ClientSentEventsMap = {
  joinLobby: (lobbyId: LobbyId) => void;
  leaveLobby: (lobbyId: LobbyId) => void;
  joinGame: (gameId: GameId) => void;
  leaveGame: (gameId: GameId) => void;
  startGame: (gameId: GameId) => void;
  rollDice: (userId: UserId) => void;
  pass: (userId: UserId) => void;
  buildEstablishment: (payload: { userId: UserId; establishmentToBuild: EstablishmentId }) => void;
  buildLandmark: (payload: { userId: UserId; landmarkToBuild: LandmarkId }) => void;
};

export type ClientSentActionTypes = GetActionTypes<ClientSentEventsMap>;
