import { CreateLobbyRequestBody, CreateLobbyResponse } from '@machikoro/game-server-contracts';
import { action, payload } from 'ts-action';

enum LobbyActionType {
  SET_IS_CREATE_LOBBY_LOADING_DOCUMENT = '[DOCUMENT] APP/LOBBY/SET_IS_CREATE_LOBBY_LOADING',
  CREATE_LOBBY_COMMAND = '[COMMAND] APP/LOBBY/CREATE_LOBBY',
  CREATE_LOBBY_RESOLVED_EVENT = '[EVENT] APP/LOBBY/CREATE_LOBBY/RESOLVED',
  CREATE_LOBBY_REJECTED_EVENT = '[EVENT] APP/LOBBY/CREATE_LOBBY/REJECTED',
}

export const setIsCreateLobbyLoadingDocument = action(
  LobbyActionType.SET_IS_CREATE_LOBBY_LOADING_DOCUMENT,
  payload<boolean>(),
);

export const createLobbyCommand = action(
  LobbyActionType.CREATE_LOBBY_COMMAND,
  payload<CreateLobbyRequestBody>(),
);

export const createLobbyResolvedEvent = action(
  LobbyActionType.CREATE_LOBBY_RESOLVED_EVENT,
  payload<CreateLobbyResponse>(),
);

export const createLobbyRejectedEvent = action(
  LobbyActionType.CREATE_LOBBY_REJECTED_EVENT,
  payload<string>(),
);

export type LobbyAction =
  | ReturnType<typeof setIsCreateLobbyLoadingDocument>
  | ReturnType<typeof createLobbyCommand>
  | ReturnType<typeof createLobbyResolvedEvent>
  | ReturnType<typeof createLobbyRejectedEvent>;

export const lobbyActions = {
  createLobbyCommand,
};
