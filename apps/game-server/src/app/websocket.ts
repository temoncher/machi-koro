import * as http from 'http';

import {
  ClientSentEventsMap,
  GameId,
  UserId,
  Game,
  Lobby,
  ServerSentEventsMap,
  LobbyId,
} from '@machikoro/game-server-contracts';
import * as SocketIO from 'socket.io';

import { handleGameEvents, HandleGameEventsDependencies } from './games/games.websocket';
import { handleLobbyEvents, HandleLobbyEventsDependencies } from './lobbies';
import {
  AuthMiddlewareLocals,
  authSocketMiddleware,
  AuthSocketMiddlewareDependencies,
} from './shared';
import { AppSocket } from './types';

type OnDisconnectingDependencies = {
  leaveLobbyAsUser: (userToDeleteId: UserId, lobbyId: LobbyId) => Promise<Error | Lobby>;
  disconnectUserFromGame: (userToConnectId: UserId, gameId: GameId,) => Promise<'OK'>;
  getGame: (gameId: GameId) => Promise<Game | undefined>;
};

const onDisconnecting = (
  { leaveLobbyAsUser, disconnectUserFromGame, getGame }: OnDisconnectingDependencies,
) => async (socket: AppSocket): Promise<void> => {
  // authSocketMiddleware checked and put currentUser object in socket.data
  const { currentUser } = socket.data as AuthMiddlewareLocals;

  const rooms = [...socket.rooms];

  // TODO: Think about disconnect logic and "are you here" requests
  const lobbiesRequests = rooms.map(async (roomId) => {
    const game = await getGame(roomId);

    const actionToPerform = game ? disconnectUserFromGame : leaveLobbyAsUser;

    await actionToPerform(currentUser.userId, roomId);
  });

  await Promise.all(lobbiesRequests);

  rooms.forEach((roomId) => socket.in(roomId).emit('LOBBY_USER_LEFT', { user: currentUser, lobbyId: roomId }));
};

type OnConnectionDependencies = HandleLobbyEventsDependencies & HandleGameEventsDependencies & OnDisconnectingDependencies;
const onConnection = (
  onConnectionDependencies: OnConnectionDependencies,
) => (
  socket: AppSocket,
): void => {
  handleLobbyEvents(onConnectionDependencies)(socket);

  handleGameEvents(onConnectionDependencies)(socket);

  socket.on('disconnecting', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    onDisconnecting(onConnectionDependencies)(socket);
  });
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
