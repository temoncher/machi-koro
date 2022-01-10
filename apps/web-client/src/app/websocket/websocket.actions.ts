import { ClientSentActionTypes, ServerSentActionTypes } from '@machikoro/game-server-contracts';
import { action, payload } from 'ts-action';

import { WebsocketConnectionStatus } from '../types/WebsocketConnectionStatus';

type ServerSentActionTypesUnion = ServerSentActionTypes[keyof ServerSentActionTypes];
type ClientSentActionTypesUnion = ClientSentActionTypes[keyof ClientSentActionTypes];

enum WebsocketActionType {
  SET_SOCKET_CONNECTION_STATUS_DOCUMENT = '[DOCUMENT] APP/WS/SET_SOCKET_CONNECTION_STATUS',
  INITIALIZE_SOCKET_COMMAND = '[COMMAND] APP/WS/INITIALIZE_SOCKET',
  INITIALIZE_SOCKET_RESOLVED_EVENT = '[EVENT] APP/WS/INITIALIZE_SOCKET/RESOLVED',
  INITIALIZE_SOCKET_REJECTED_EVENT = '[EVENT] APP/WS/INITIALIZE_SOCKET/REJECTED',
  SEND_WS_MESSAGE_COMMAND = '[COMMAND] APP/WS/SEND_WS_MESSAGE_COMMAND',
  WS_MESSAGE_RECEIVED_EVENT = '[EVENT] APP/WS/WS_MESSAGE_RECEIVED',
}

export namespace WebsocketAction {
  export const setSocketConnectionStatusDocument = action(
    WebsocketActionType.SET_SOCKET_CONNECTION_STATUS_DOCUMENT,
    payload<WebsocketConnectionStatus>(),
  );
  export const initializeSocketCommand = action(WebsocketActionType.INITIALIZE_SOCKET_COMMAND);
  export const initializeSocketResolvedEvent = action(WebsocketActionType.INITIALIZE_SOCKET_RESOLVED_EVENT);
  export const initializeSocketRejectedEvent = action(WebsocketActionType.INITIALIZE_SOCKET_REJECTED_EVENT);
  export const sendWsMessageCommand = action(
    WebsocketActionType.SEND_WS_MESSAGE_COMMAND,
    payload<ClientSentActionTypesUnion>(),
  );
  export const wsMessageReceivedEvent = action(
    WebsocketActionType.WS_MESSAGE_RECEIVED_EVENT,
    payload<ServerSentActionTypesUnion>(),
  );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WebsocketAction =
  | ReturnType<typeof WebsocketAction.setSocketConnectionStatusDocument>
  | ReturnType<typeof WebsocketAction.initializeSocketCommand>
  | ReturnType<typeof WebsocketAction.initializeSocketResolvedEvent>
  | ReturnType<typeof WebsocketAction.initializeSocketRejectedEvent>
  | ReturnType<typeof WebsocketAction.sendWsMessageCommand>
  | ReturnType<typeof WebsocketAction.wsMessageReceivedEvent>;
