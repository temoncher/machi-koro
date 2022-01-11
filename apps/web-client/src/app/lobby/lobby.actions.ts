import {
  CreateLobbyResponse,
  GameId,
  LobbyId,
  PopulatedLobbyState,
  User,
} from '@machikoro/game-server-contracts';
import { action, payload } from 'ts-action';

enum LobbyActionType {
  ENTERED_LOBBY_PAGE_EVENT = '[EVENT] APP/LOBBY/ENTERED_LOBBY_PAGE',
  SET_IS_CREATE_LOBBY_LOADING_DOCUMENT = '[DOCUMENT] APP/LOBBY/SET_IS_CREATE_LOBBY_LOADING',
  CREATE_LOBBY_COMMAND = '[COMMAND] APP/LOBBY/CREATE_LOBBY',
  CREATE_LOBBY_RESOLVED_EVENT = '[EVENT] APP/LOBBY/CREATE_LOBBY/RESOLVED',
  CREATE_LOBBY_REJECTED_EVENT = '[EVENT] APP/LOBBY/CREATE_LOBBY/REJECTED',
  JOIN_LOBBY_COMMAND = '[COMMAND] APP/LOBBY/JOIN_LOBBY',
  JOIN_LOBBY_RESOLVED_EVENT = '[EVENT] APP/LOBBY/JOIN_LOBBY/RESOLVED',
  JOIN_LOBBY_REJECTED_EVENT = '[EVENT] APP/LOBBY/JOIN_LOBBY/REJECTED',
  HOST_CHANGED_EVENT = '[EVENT] APP/LOBBY/HOST_CHANGED',
  SET_LOBBY_DOCUMENT = '[DOCUMENT] APP/LOBBY/SET_LOBBY',
  LEAVE_LOBBY_COMMAND = '[COMMAND] APP/LOBBY/LEAVE_LOBBY',
  CURRENT_USER_LEFT_LOBBY_EVENT = '[EVENT] APP/LOBBY/CURRENT_USER_LEFT_LOBBY',
  GAME_CREATED_EVENT = '[EVENT] APP/LOBBY/GAME_CREATED',
  USER_JOINED_EVENT = '[EVENT] APP/LOBBY/USER_JOINED',
  USER_LEFT_EVENT = '[EVENT] APP/LOBBY/USER_LEFT',
}

export namespace LobbyAction {
  export const enteredLobbyPageEvent = action(
    LobbyActionType.ENTERED_LOBBY_PAGE_EVENT,
    payload<LobbyId>(),
  );

  export const setIsCreateLobbyLoadingDocument = action(
    LobbyActionType.SET_IS_CREATE_LOBBY_LOADING_DOCUMENT,
    payload<boolean>(),
  );

  export const createLobbyCommand = action(LobbyActionType.CREATE_LOBBY_COMMAND);

  export const createLobbyResolvedEvent = action(
    LobbyActionType.CREATE_LOBBY_RESOLVED_EVENT,
    payload<CreateLobbyResponse>(),
  );

  export const createLobbyRejectedEvent = action(
    LobbyActionType.CREATE_LOBBY_REJECTED_EVENT,
    payload<string>(),
  );

  export const joinLobbyCommand = action(
    LobbyActionType.JOIN_LOBBY_COMMAND,
    payload<LobbyId>(),
  );

  export const joinLobbyResolvedEvent = action(
    LobbyActionType.JOIN_LOBBY_RESOLVED_EVENT,
    payload<string>(),
  );

  export const joinLobbyRejectedEvent = action(
    LobbyActionType.JOIN_LOBBY_REJECTED_EVENT,
    payload<string>(),
  );

  export const hostChangedEvent = action(
    LobbyActionType.HOST_CHANGED_EVENT,
    payload<{ newHost: User; lobbyId: LobbyId }>(),
  );

  export const setLobbyDocument = action(
    LobbyActionType.SET_LOBBY_DOCUMENT,
    payload<PopulatedLobbyState | undefined>(),
  );

  export const leaveLobbyCommand = action(
    LobbyActionType.LEAVE_LOBBY_COMMAND,
    payload<LobbyId>(),
  );

  export const currentUserLeftLobbyEvent = action(
    LobbyActionType.CURRENT_USER_LEFT_LOBBY_EVENT,
    payload<LobbyId>(),
  );

  export const gameCreatedEvent = action(
    LobbyActionType.GAME_CREATED_EVENT,
    payload<GameId>(),
  );

  export const userJoinedEvent = action(
    LobbyActionType.USER_JOINED_EVENT,
    payload<{ user: User; lobbyId: LobbyId }>(),
  );

  export const userLeftEvent = action(
    LobbyActionType.USER_LEFT_EVENT,
    payload<{ user: User; lobbyId: LobbyId }>(),
  );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LobbyAction =
  | ReturnType<typeof LobbyAction.setIsCreateLobbyLoadingDocument>
  | ReturnType<typeof LobbyAction.createLobbyCommand>
  | ReturnType<typeof LobbyAction.createLobbyResolvedEvent>
  | ReturnType<typeof LobbyAction.createLobbyRejectedEvent>
  | ReturnType<typeof LobbyAction.joinLobbyCommand>
  | ReturnType<typeof LobbyAction.setLobbyDocument>
  | ReturnType<typeof LobbyAction.leaveLobbyCommand>
  | ReturnType<typeof LobbyAction.gameCreatedEvent>;

export const lobbyActions = {
  createLobbyCommand: LobbyAction.createLobbyCommand,
  leaveLobbyCommand: LobbyAction.leaveLobbyCommand,
};
