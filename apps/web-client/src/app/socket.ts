import {
  ClientSentEventsMap,
  ServerSentEventsMap,
  User,
} from '@machikoro/game-server-contracts';
import * as SocketIOClient from 'socket.io-client';

import { getAuthorizationHeader } from './utils';

let socket: SocketIOClient.Socket<ServerSentEventsMap, ClientSentEventsMap> | undefined;

export const initializeSocket = (): void => {
  const token = getAuthorizationHeader();

  // TODO: add the error hadler with a snackbar or something
  if (!token) {
    return;
  }

  socket = SocketIOClient.io('http://localhost:3333', {
    auth: {
      token,
    },
  });

  // Common
  socket.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('connection established');
  });
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('connection established');
  });
  socket.on('SERVER_ERROR', () => {
    // eslint-disable-next-line no-console
    console.log('Something went terribly wrong');
  });
  socket.on('JOINED_ERROR', () => {
    // eslint-disable-next-line no-console
    console.log('Error connect new user');
  });

  // Lobby
  socket.on('LOBBY_USER_JOINED', (user: User) => {
    // eslint-disable-next-line no-console
    console.log(`Connect new user ${user.username}`, user);
  });
  socket.on('LOBBY_USER_LEAVE', (user: User) => {
    // eslint-disable-next-line no-console
    console.log(`Disconnect user ${user.username}`, user);
  });
  socket.on('LOBBY_ERROR_MAX_USERS', () => {
    // eslint-disable-next-line no-console
    console.log('The number of players is exceeded');
  });
  socket.on('LOBBY_STATE_UPDATED', (lobbyState) => {
    // eslint-disable-next-line no-console
    console.log('Lobby state', lobbyState);
  });
  socket.on('LOBBY_LEAVE', () => {
    // eslint-disable-next-line no-console
    console.log('You have left the lobby');
  });
};

export const joinLobby = (lobbyId: string): void => {
  socket?.emit('joinLobby', lobbyId);
};

export const leaveLobby = (lobbyId: string): void => {
  socket?.emit('leaveLobby', lobbyId);
};
