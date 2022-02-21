import {
  ClientSentActionTypes,
  Game,
  GameId,
  UserId,
  UserStatus,
} from '@machikoro/game-server-contracts';
import { interpret } from 'xstate';

import { gameMachine } from '../game-machine';
import { AuthMiddlewareLocals } from '../shared';
import { AppSocket } from '../types';

const machine = interpret(gameMachine);

type StartGameDependencies = {
  getGame: (gameId: GameId) => Promise<Game | undefined>;
};

const startGame = ({
  getGame,
}: StartGameDependencies) => (socket: AppSocket) => async (gameId: GameId): Promise<void> => {
  const game = await getGame(gameId);

  if (!game) {
    // TODO: emit error
    return;
  }

  const { users } = game;

  machine.start();

  const state = machine.send('START_GAME', { usersIds: users });

  socket.emit('GAME_STARTED', state.context);
};

const rollDice = (socket: AppSocket) => (userId: UserId) => {
  const state = machine.send('ROLL_DICE', { userId });

  if (state.changed) {
    return socket.emit('DICE_ROLLED', state.context.rollDiceResult);
  }

  return socket.emit('GAME_ERROR', `Error at event ${state.event.type}.`);
};

const buildEstablishment = (socket: AppSocket) => (payload: ClientSentActionTypes['buildEstablishment']['payload']) => {
  const state = machine.send('BUILD_ESTABLISHMENT', payload);

  if (state.changed) {
    return socket.emit('BUILD_ESTABLISHMENT', state.context);
  }

  return socket.emit('GAME_ERROR', `Error at event ${state.event.type}.`);
};

const buildLandmark = (socket: AppSocket) => (payload: ClientSentActionTypes['buildLandmark']['payload']) => {
  const state = machine.send('BUILD_LANDMARK', payload);

  if (state.changed) {
    return socket.emit('BUILD_LANDMARK', state.context);
  }

  return socket.emit('GAME_ERROR', `Error at event ${state.event.type}.`);
};

const pass = (socket: AppSocket) => (userId: UserId) => {
  const state = machine.send('PASS', { userId });

  if (state.changed) {
    return socket.emit('PASS', state.context);
  }

  return socket.emit('GAME_ERROR', `Error at event ${state.event.type}.`);
};

type JoinGameDependencies = {
  connectUserToGame: (userToConnectId: UserId, gameId: GameId,) => Promise<'OK'>;
  getGame: (gameId: GameId) => Promise<Game | undefined>;
};

const joinGame = ({
  connectUserToGame,
  getGame,
}: JoinGameDependencies) => (socket: AppSocket) => async (
  gameId: GameId,
): Promise<void> => {
  try {
    // authSocketMiddleware checked and put currentUser object in socket.data
    const { currentUser: { userId } } = socket.data as AuthMiddlewareLocals;

    const game = await getGame(gameId);

    if (!game) {
      // TODO: emit error
      return;
    }

    const isRegusteredUserInGame = game.users.some((possibleUserId) => possibleUserId === userId);

    if (!isRegusteredUserInGame) {
      // TODO: emit error
      return;
    }

    await connectUserToGame(userId, gameId);

    const gameWithConnectedUser = {
      ...game,
      userStatusesMap: {
        ...game.usersStatusesMap,
        [userId]: UserStatus.CONNECTED,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.join(gameId);
    socket.in(gameId).emit('GAME_USER_JOINED', userId);
    socket.emit('GAME_STATE_UPDATED', gameWithConnectedUser);
  } catch (error: unknown) {
    socket.emit('GAME_JOIN_ERROR');
    // eslint-disable-next-line no-console
    console.error('join game error: ', error);
  }
};

type LeaveGameDependencies = {
  disconnectUserFromGame: (userToConnectId: UserId, gameId: GameId,) => Promise<'OK'>;
};

const leaveGame = ({
  disconnectUserFromGame,
}: LeaveGameDependencies) => (socket: AppSocket) => async (
  gameId: GameId,
): Promise<void> => {
  try {
    // authSocketMiddleware checked and put currentUser object in socket.data
    const { currentUser: { userId } } = socket.data as AuthMiddlewareLocals;

    await disconnectUserFromGame(userId, gameId);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.leave(gameId);
    socket.in(gameId).emit('GAME_USER_LEFT', userId);
    socket.emit('GAME_USER_LEFT', userId);
  } catch (error: unknown) {
    socket.emit('GAME_LEAVE_ERROR');
    // eslint-disable-next-line no-console
    console.error('leave game error: ', error);
  }
};

export type HandleGameEventsDependencies = JoinGameDependencies & LeaveGameDependencies & StartGameDependencies;

export const handleGameEvents = (handleGameEventsDependencies: HandleGameEventsDependencies) => (socket: AppSocket): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('joinGame', joinGame(handleGameEventsDependencies)(socket));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('leaveGame', leaveGame(handleGameEventsDependencies)(socket));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('startGame', startGame(handleGameEventsDependencies)(socket));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('rollDice', rollDice(socket));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('buildEstablishment', buildEstablishment(socket));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('buildLandmark', buildLandmark(socket));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('pass', pass(socket));
};
