import * as http from 'http';

import {
  ClientSentEventsMap,
  ServerSentEventsMap,
} from '@machikoro/game-server-contracts';
import * as SocketIO from 'socket.io';

import { LobbyRepository, handleLobbyEvents } from './lobbies';
import { AuthMiddlewareLocals, authSocketMiddleware, getUsers } from './shared';
import { AppSocket, WebsocketHandlersDependencies } from './types';

type OnDisconnectingDependencies = {
  removeUserFromLobby: (userToDeleteId: string, lobbyId: string) => Promise<number>;
  socket: AppSocket;
};

const onDisconnecting = async ({ removeUserFromLobby, socket }: OnDisconnectingDependencies): Promise<void> => {
  // authSocketMiddleware checked and put currentUser object in socket.data
  const { currentUser: { userId, username, type } } = socket.data as AuthMiddlewareLocals;

  const lobbies = [...socket.rooms];

  const lobbiesRequests = lobbies.map(async (lobbyId) => removeUserFromLobby(userId, lobbyId));

  await Promise.all(lobbiesRequests);

  lobbies.forEach((lobbyId) => socket.in(lobbyId).emit('LOBBY_USER_LEAVE', { userId, username, type }));
};

const onConnection = (
  websocketHandlersDependencies: WebsocketHandlersDependencies,
) => (
  socket: AppSocket,
): void => {
  const lobbyRepository = LobbyRepository.init(websocketHandlersDependencies.redisClientLobbies);

  handleLobbyEvents(
    {
      removeUserFromLobby: lobbyRepository.removeUserFromLobby,
      addUserToLobby: lobbyRepository.addUserToLobby,
      getLobby: lobbyRepository.getLobby,
      getUsers: getUsers(websocketHandlersDependencies.redisClientUsers),
      socket,
    },
  );
  socket.on('disconnecting', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    onDisconnecting({
      removeUserFromLobby: lobbyRepository.removeUserFromLobby,
      socket,
    });
  });
};

export const initSocketServer = (
  websocketHandlersDependencies: WebsocketHandlersDependencies,
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
  io.use(authSocketMiddleware(websocketHandlersDependencies.redisClientUsers));
  io.on('connection', onConnection(websocketHandlersDependencies));

  return io;
};
