import {
  ClientSentEventsMap,
  EstablishmentId,
  GameId,
  LandmarkId,
  ServerSentEventsMap,
  UserId,
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
  socket.on('JOIN_ERROR', () => {
    // eslint-disable-next-line no-console
    console.log('Error connect new user');
  });

  // Lobby
  socket.on('LOBBY_USER_JOINED', (user) => {
    // eslint-disable-next-line no-console
    console.log(`Connect new user ${user.username}`, user);
  });
  socket.on('LOBBY_USER_LEFT', (user) => {
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
  // Game
  socket.on('GAME_STATE_UPDATED', (gameState) => {
    // eslint-disable-next-line no-console
    console.log('Game state', gameState);
  });
  socket.on('GAME_USER_JOINED', (userId) => {
    // eslint-disable-next-line no-console
    console.log(`Connect new user, id = ${userId}`);
  });
  socket.on('GAME_USER_LEFT', (userId) => {
    // eslint-disable-next-line no-console
    console.log(`Disconnect user ${userId}`);
  });
  socket.on('GAME_ERROR_ACCESS', () => {
    // eslint-disable-next-line no-console
    console.log('Access denied');
  });

  // Machine
  socket.on('GAME_STARTED', (stateMachine) => {
    // eslint-disable-next-line no-console
    console.log(stateMachine);
  });

  socket.on('DICE_ROLLED', (resultRollDice) => {
    // eslint-disable-next-line no-console
    console.log(`Result roll dice ${resultRollDice}`);
  });

  socket.on('BUILD_ESTABLISHMENT', (stateMachine) => {
    // eslint-disable-next-line no-console
    console.log(stateMachine);
  });

  socket.on('BUILD_LANDMARK', (stateMachine) => {
    // eslint-disable-next-line no-console
    console.log(stateMachine);
  });

  socket.on('PASS', (stateMachine) => {
    // eslint-disable-next-line no-console
    console.log(stateMachine);
  });

  socket.on('GAME_ERROR', (message) => {
    // eslint-disable-next-line no-console
    console.log(message);
  });
};

export const joinLobby = (lobbyId: string): void => {
  socket?.emit('joinLobby', lobbyId);
};

export const leaveLobby = (lobbyId: string): void => {
  socket?.emit('leaveLobby', lobbyId);
};

export const joinGame = (gameId: GameId): void => {
  socket?.emit('joinGame', gameId);
};

export const leaveGame = (gameId: GameId): void => {
  socket?.emit('leaveGame', gameId);
};

export const startGame = (gameId: GameId): void => {
  socket?.emit('startGame', gameId);
};

export const rollDice = (userId: UserId): void => {
  socket?.emit('rollDice', userId);
};

export const buildEstablishment = (userId: UserId) => (establishmentId: EstablishmentId): void => {
  socket?.emit('buildEstablishment', userId, establishmentId);
};

export const buildLandmark = (userId: UserId) => (landmarkId: LandmarkId): void => {
  socket?.emit('buildLandmark', userId, landmarkId);
};

export const pass = (userId: UserId): void => {
  socket?.emit('pass', userId);
};
