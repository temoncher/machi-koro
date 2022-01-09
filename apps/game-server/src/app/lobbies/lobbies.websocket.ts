import {
  Lobby,
  LobbyId,
  PopulatedLobbyState,
  User,
  UserId,
} from '@machikoro/game-server-contracts';
import { ZodError } from 'zod';

import { AuthMiddlewareLocals } from '../shared';
import { AppSocket } from '../types';

type LeaveLobbyDependencies = {
  leaveLobbyAsUser: (userToDeleteId: UserId, lobbyId: LobbyId) => Promise<Error | Lobby>;
  getUsers: (users: UserId[]) => Promise<(User | ZodError)[]>;
};

const leaveLobby = ({ leaveLobbyAsUser, getUsers }: LeaveLobbyDependencies) => (socket: AppSocket) => async (lobbyId: LobbyId) => {
  try {
    // authSocketMiddleware checked and put currentUser object in socket.data
    const { currentUser: { userId, username, type } } = socket.data as AuthMiddlewareLocals;

    const user: User = {
      userId,
      username,
      type,
    };

    const lobbyOrError = await leaveLobbyAsUser(
      userId,
      lobbyId,
    );

    if (lobbyOrError instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(lobbyOrError.message);

      return;
    }

    const usersOrErrors = await getUsers(lobbyOrError.users);
    const hasErrors = usersOrErrors.some((possibleUser) => possibleUser instanceof ZodError);

    if (hasErrors) {
      // TODO: emit error
      // eslint-disable-next-line no-console
      console.log('there are errors in user requests', usersOrErrors);

      return;
    }

    // This type cast is safe, because we already checked that possibleUsers has no errors inside of it
    const users = usersOrErrors as User[];

    const newLobbyState: PopulatedLobbyState = {
      hostId: lobbyOrError.hostId,
      users,
    };

    // TODO: close lobby on host leave
    socket.nsp.to(lobbyId).emit('LOBBY_USER_LEFT', { user, lobbyId });
    // TODO: make these commands reactive with (room events)[https://socket.io/docs/v3/rooms/#room-events]
    socket.emit('LOBBY_LEFT_SUCCESSFULLY', lobbyId);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.leave(lobbyId);
    socket.nsp.to(lobbyId).emit('LOBBY_STATE_UPDATED', newLobbyState);

    // eslint-disable-next-line no-console
    console.log(`user(${username}:${userId}) left the lobby(${lobbyId})`);
  } catch (error: unknown) {
    socket.emit('LOBBY_LEAVE_ERROR');

    // eslint-disable-next-line no-console
    console.error('leave lobby error: ', error);
  }
};

type JoinLobbyDependencies = {
  joinLobbyAsUser: (userToDeleteId: UserId, lobbyId: LobbyId) => Promise<Error | Lobby>;
  getUsers: (users: UserId[]) => Promise<(User | ZodError)[]>;
};

const joinLobby = ({
  joinLobbyAsUser,
  getUsers,
}: JoinLobbyDependencies) => (socket: AppSocket) => async (lobbyId: LobbyId) => {
  try {
    // authSocketMiddleware checked and put currentUser object in socket.data
    const { currentUser: { userId, type, username } } = socket.data as AuthMiddlewareLocals;

    const lobbyOrError = await joinLobbyAsUser(userId, lobbyId);

    if (lobbyOrError instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(lobbyOrError.message);

      return;
    }

    const usersOrErrors = await getUsers(lobbyOrError.users);
    const hasErrors = usersOrErrors.some((possibleUser) => possibleUser instanceof ZodError);

    if (hasErrors) {
      // TODO: emit error
      // eslint-disable-next-line no-console
      console.log('there are errors in user requests', usersOrErrors);

      return;
    }

    // This type cast is safe, because we already checked that possibleUsers has no errors inside of it
    const users = usersOrErrors as User[];

    const newLobbyState: PopulatedLobbyState = {
      hostId: lobbyOrError.hostId,
      users,
    };

    const user: User = {
      userId,
      type,
      username,
    };

    socket.nsp.to(lobbyId).emit('LOBBY_USER_JOINED', { user, lobbyId });
    socket.emit('LOBBY_JOINED_SUCCESSFULLY', lobbyId);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.join(lobbyId);
    socket.nsp.to(lobbyId).emit('LOBBY_STATE_UPDATED', newLobbyState);

    // eslint-disable-next-line no-console
    console.log(`user(${username}:${userId}) joined the lobby(${lobbyId})`);
  } catch (error: unknown) {
    socket.emit('LOBBY_JOIN_ERROR');
    // eslint-disable-next-line no-console
    console.error('join lobby error: ', error);
  }
};

export type HandleLobbyEventsDependencies = JoinLobbyDependencies & LeaveLobbyDependencies;

export const handleLobbyEvents = (handleLobbyEventsDependencies: HandleLobbyEventsDependencies) => (socket: AppSocket): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('joinLobby', joinLobby(handleLobbyEventsDependencies)(socket));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('leaveLobby', leaveLobby(handleLobbyEventsDependencies)(socket));
};
