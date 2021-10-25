import {
  Lobby,
  LobbyState,
  User,
  validateLobby,
} from '@machikoro/game-server-contracts';
import { ZodError } from 'zod';

import { AuthMiddlewareLocals } from '../shared';
import { AppSocket } from '../types';

type LeaveLobbyDependencies = {
  removeUserFromLobby: (userToDeleteId: string, lobbyId: string) => Promise<number>;
};
const leaveLobby = ({ removeUserFromLobby }: LeaveLobbyDependencies) => (socket: AppSocket) => async (lobbyId: string) => {
  try {
    // authSocketMiddleware checked and put currentUser object in socket.data
    const { currentUser: { userId, username, type } } = socket.data as AuthMiddlewareLocals;

    const user: User = {
      userId,
      username,
      type,
    };

    await removeUserFromLobby(
      userId,
      lobbyId,
    );

    socket.in(lobbyId).emit('LOBBY_USER_LEFT', user);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.leave(lobbyId);
    socket.emit('LOBBY_USER_LEFT', user);
  } catch (error: unknown) {
    socket.emit('SERVER_ERROR');
  }
};

type JoinLobbyDependencies = {
  addUserToLobby: (userToDeleteId: string, lobbyId: string) => Promise<unknown>;
  getLobby: (lobbyId: string) => Promise<Lobby | undefined>;
  getUsers: (users: string[]) => Promise<(User | ZodError)[]>;
};

const joinLobby = ({
  addUserToLobby,
  getLobby,
  getUsers,
}: JoinLobbyDependencies) => (socket: AppSocket) => async (lobbyId: string) => {
  try {
    const lobby = await getLobby(lobbyId);

    const lobbyOrError = validateLobby(lobby);

    if (!lobbyOrError) {
      // TODO: emit error
      return;
    }

    // authSocketMiddleware checked and put currentUser object in socket.data
    const { currentUser: { userId, type, username } } = socket.data as AuthMiddlewareLocals;

    const isUserAlreadyInLobby = lobbyOrError.users.some((currentUserId) => userId === currentUserId);

    if (isUserAlreadyInLobby) {
      // TODO: emit error
      return;
    }

    await addUserToLobby(userId, lobbyId);

    const lobbyWithUpdatedUsers = {
      ...lobbyOrError,
      users: [...lobbyOrError.users, userId],
    };

    const possibleUsers = await getUsers(lobbyWithUpdatedUsers.users);
    const hasErrors = possibleUsers.some((possibleUser) => possibleUser instanceof ZodError);

    if (hasErrors) {
      // TODO: emit error
      return;
    }

    // This type cast is safe, because we already checked that possibleUsers has no errors inside of it
    const users = possibleUsers as User[];

    const newLobbyState: LobbyState = {
      hostId: lobbyWithUpdatedUsers.hostId,
      users,
    };

    const user: User = {
      userId,
      type,
      username,
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.join(lobbyId);
    socket.in(lobbyId).emit('LOBBY_USER_JOINED', user);
    socket.emit('LOBBY_STATE_UPDATED', newLobbyState);
  } catch (error: unknown) {
    socket.emit('JOIN_ERROR');
  }
};

export type HandleLobbyEventsDependencies = JoinLobbyDependencies & LeaveLobbyDependencies;

export const handleLobbyEvents = (handleLobbyEventsDependencies: HandleLobbyEventsDependencies) => (socket: AppSocket): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('joinLobby', joinLobby(handleLobbyEventsDependencies)(socket));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  socket.on('leaveLobby', leaveLobby(handleLobbyEventsDependencies)(socket));
};
