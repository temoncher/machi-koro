import * as http from 'http';

import {
  ClientSentEventsMap,
  ServerSentEventsMap,
} from '@machikoro/game-server-contracts';
import * as SocketIO from 'socket.io';

import { handleGameEvents, HandleGameEventsDependencies } from './games/games.websocket';
import { handleLobbyEvents, HandleLobbyEventsDependencies } from './lobbies';
import {
  authSocketMiddleware,
  AuthSocketMiddlewareDependencies,
} from './shared';
import { AppSocket } from './types';

type OnConnectionDependencies = HandleLobbyEventsDependencies & HandleGameEventsDependencies;
const onConnection = (
  onConnectionDependencies: OnConnectionDependencies,
) => (
  socket: AppSocket,
): void => {
  handleLobbyEvents(onConnectionDependencies)(socket);

  handleGameEvents(onConnectionDependencies)(socket);
};

export type SocketServerDependencies = AuthSocketMiddlewareDependencies & OnConnectionDependencies;

export const initSocketServer = (
  options: Partial<SocketIO.ServerOptions>,
  socketServerDependencies: SocketServerDependencies,
  server: http.Server,
): SocketIO.Server<ClientSentEventsMap, ServerSentEventsMap, ServerSentEventsMap> => {
  const io = new SocketIO.Server(server, options);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  io.use(authSocketMiddleware(socketServerDependencies));
  io.on('connection', onConnection(socketServerDependencies));

  return io;
};
