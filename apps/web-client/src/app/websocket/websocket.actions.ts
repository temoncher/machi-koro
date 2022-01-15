/* eslint-disable no-multiple-empty-lines */
import { ClientSentActionTypes, ServerSentActionTypes } from '@machikoro/game-server-contracts';
import { empty, payload } from 'ts-action';

import { WebsocketConnectionStatus } from '../types/WebsocketConnectionStatus';
import { createActionsNamespace, GetNamespaceActionType } from '../utils/createActionsNamespace';

type ServerSentActionTypesUnion = ServerSentActionTypes[keyof ServerSentActionTypes];
type ClientSentActionTypesUnion = ClientSentActionTypes[keyof ClientSentActionTypes];

const websocketActionTypeToPayloadMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  '[DOCUMENT] APP/WS/SET_SOCKET_CONNECTION_STATUS': payload<WebsocketConnectionStatus>(),
  '[COMMAND] APP/WS/INITIALIZE_SOCKET': empty(),
  '[EVENT] APP/WS/INITIALIZE_SOCKET_RESOLVED': empty(),
  '[EVENT] APP/WS/INITIALIZE_SOCKET_REJECTED': empty(),
  '[COMMAND] APP/WS/SEND_WS_MESSAGE': payload<ClientSentActionTypesUnion>(),
  '[EVENT] APP/WS/WS_MESSAGE_RECEIVED': payload<ServerSentActionTypesUnion>(),
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const WebsocketAction = createActionsNamespace(websocketActionTypeToPayloadMap);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WebsocketAction = GetNamespaceActionType<typeof WebsocketAction>;
