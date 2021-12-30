import {
  Game,
  GameState,
  User,
  UserStatus,
} from '@machikoro/game-server-contracts';
import { interpret } from 'xstate';
import { ZodError } from 'zod';

import { gameMachine } from '../game-machine';
import { AuthMiddlewareLocals } from '../shared';
import { AppSocket } from '../types';

const machine = interpret(gameMachine);

type StartGameDependencies = {
  getGame: (gameId: string) => Promise<Game | undefined>;
};

const startGame = ({
  getGame,
}: StartGameDependencies) => (socket: AppSocket) => async (gameId: string): Promise<void> => {
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

const rollDice = (socket: AppSocket) => (userId: string) => {
  const state = machine.send('ROLL_DICE', { userId });

  if (state.changed) {
    return socket.emit('DICE_ROLLED', state.context.rollDiceResult);
  }

  return socket.emit('GAME_ERROR', `Error at event ${state.event.type}.`);
};

const buildEstablishment = (socket: AppSocket) => (userId: string, establishmentToBuild: string) => {
  const state = machine.send('BUILD_ESTABLISHMENT', { userId, establishmentToBuild });

  if (state.changed) {
    return socket.emit('BUILD_ESTABLISHMENT', state.context);
  }

  return socket.emit('GAME_ERROR', `Error at event ${state.event.type}.`);
};

const buildLandmark = (socket: AppSocket) => (userId: string, landmarkToBuild: string) => {
  const state = machine.send('BUILD_LANDMARK', { userId, landmarkToBuild });

  if (state.changed) {
    return socket.emit('BUILD_LANDMARK', state.context);
  }

  return socket.emit('GAME_ERROR', `Error at event ${state.event.type}.`);
};

const pass = (socket: AppSocket) => (userId: string) => {
  const state = machine.send('PASS', { userId });

  if (state.changed) {
    return socket.emit('PASS', state.context);
  }

  return socket.emit('GAME_ERROR', `Error at event ${state.event.type}.`);
};

type JoinGameDependencies = {
  connectUserToGame: (userToConnectId: string, gameId: string,) => Promise<'OK'>;
  getGame: (gameId: string) => Promise<Game | undefined>;
  getUsers: (users: string[]) => Promise<(User | ZodError)[]>;
};

const joinGame = ({
  connectUserToGame,
  getGame,
  getUsers,
}: JoinGameDependencies) => (socket: AppSocket) => async (
  gameId: string,
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
    game.usersStatusesMap[userId] = UserStatus.CONNECTED;

    const possibleUsers = await getUsers(game.users);
    const hasErrors = possibleUsers.some((possibleUser) => possibleUser instanceof ZodError);

    if (hasErrors) {
      // TODO: emit error
      return;
    }

    // This type cast is safe, because we already checked that possibleUsers has no errors inside of it
    const users = possibleUsers as User[];

    const newGameState: GameState = {
      gameId,
      hostId: game.hostId,
      users,
      usersStatusesMap: {
        ...game.usersStatusesMap,
        [userId]: UserStatus.CONNECTED,

      },
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.join(gameId);
    socket.in(gameId).emit('GAME_USER_JOINED', userId);
    socket.emit('GAME_STATE_UPDATED', newGameState);
  } catch (error: unknown) {
    socket.emit('JOIN_ERROR');
  }
};

type LeaveGameDependencies = {
  disconnectUserFromGame: (userToConnectId: string, gameId: string,) => Promise<'OK'>;
};

const leaveGame = ({
  disconnectUserFromGame,
}: LeaveGameDependencies) => (socket: AppSocket) => async (
  gameId: string,
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
    socket.emit('SERVER_ERROR');
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
