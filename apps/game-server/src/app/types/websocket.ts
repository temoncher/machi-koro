import {
  ClientSentEventsMap,
  ServerSentEventsMap,
} from '@machikoro/game-server-contracts';
import * as SocketIO from 'socket.io';

import { ServerSideEventsMap } from './ServerSideEvents';

export type AppSocket = SocketIO.Socket<ClientSentEventsMap, ServerSentEventsMap, ServerSideEventsMap>;
