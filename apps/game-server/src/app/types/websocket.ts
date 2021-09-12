import {
  ClientSentEventsMap,
  ServerSentEventsMap,
} from '@machikoro/game-server-contracts';
import * as SocketIO from 'socket.io';

import { PromisifiedRedisClient } from '../utils';

import { ServerSideEventsMap } from './ServerSideEvents';

export type AppSocket = SocketIO.Socket<ClientSentEventsMap, ServerSentEventsMap, ServerSideEventsMap>;

export type WebsocketHandlersDependencies = {
  redisClientUsers: PromisifiedRedisClient;
  redisClientLobbies: PromisifiedRedisClient;
};
