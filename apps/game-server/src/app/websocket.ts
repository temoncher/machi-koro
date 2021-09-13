import * as http from 'http';

import {
  ClientSentEventsMap,
  ServerSentEventsMap,
} from '@machikoro/game-server-contracts';
import * as SocketIO from 'socket.io';

import { handleLobbyEvents, HandleLobbyEventsDependencies } from './lobbies';
import {
  AuthMiddlewareLocals,
  authSocketMiddleware,
  AuthSocketMiddlewareDependencies,
} from './shared';
import { AppSocket } from './types';

type OnDisconnectingDependencies = {
  removeUserFromLobby: (userToDeleteId: string, lobbyId: string) => Promise<number>;
};

const onDisconnecting = ({ removeUserFromLobby }: OnDisconnectingDependencies) => async (socket: AppSocket): Promise<void> => {
  // authSocketMiddleware checked and put currentUser object in socket.data
  const { currentUser: { userId, username, type } } = socket.data as AuthMiddlewareLocals;

  const lobbies = [...socket.rooms];

  const lobbiesRequests = lobbies.map(async (lobbyId) => removeUserFromLobby(userId, lobbyId));

  await Promise.all(lobbiesRequests);

  lobbies.forEach((lobbyId) => socket.in(lobbyId).emit('LOBBY_USER_LEAVE', { userId, username, type }));
};

type OnConnectionDependencies = HandleLobbyEventsDependencies & OnDisconnectingDependencies;
const onConnection = (
  onConnectionDependencies: OnConnectionDependencies,
) => (
  socket: AppSocket,
): void => {
  handleLobbyEvents(onConnectionDependencies)(socket);

  socket.on('disconnecting', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    onDisconnecting(onConnectionDependencies)(socket);
  });
};

export type SocketServerDependencies = AuthSocketMiddlewareDependencies & OnConnectionDependencies;

export const initSocketServer = (
  socketServerDependencies: SocketServerDependencies,
  server: http.Server,
): SocketIO.Server<ClientSentEventsMap, ServerSentEventsMap, ServerSentEventsMap> => {
  const io = new SocketIO.Server(server, {
    cors: {
      origin: 'http://localhost:4200',
      credentials: true,
      methods: [
        'GET',
        'PUT',
        'POST',
        'OPTIONS',
      ],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  io.use(authSocketMiddleware(socketServerDependencies));
  io.on('connection', onConnection(socketServerDependencies));

  return io;
};
