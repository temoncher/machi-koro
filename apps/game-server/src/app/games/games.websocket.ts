import {
  Game,
  UserStatus,
} from '@machikoro/game-server-contracts';
import { interpret } from 'xstate';

import { AuthMiddlewareLocals } from '../shared';
import { AppSocket } from '../types';

import { gameMachine } from './simpleGame.machine';

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

const rollDice = (socket: AppSocket) => (userId: string): void => {
  const state = machine.send('ROLL_DICE', { userId });

  socket.emit('DICE_ROLLED', state.context.rollDiceResult);
};

type JoinGameDependencies = {
  connectUserToGame: (userToConnectId: string, gameId: string,) => Promise<'OK'>;
  getGame: (gameId: string) => Promise<Game | undefined>;
};

const joinGame = ({
  connectUserToGame,
  getGame,
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

    const newGameState: Game = {
      gameId,
      hostId: game.hostId,
      users: game.users,
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
};
