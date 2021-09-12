import { Lobby, LobbyState, User } from '@machikoro/game-server-contracts';
import { ZodError } from 'zod';

import { AuthMiddlewareLocals } from '../shared';
import { AppSocket } from '../types';

const validateLobby = (lobby: Lobby | undefined): Lobby | undefined => {
  if (!lobby || lobby.users.length > 3) {
    return undefined;
  }

  return lobby;
};

type LeaveLobbyDependencies = {
  removeUserFromLobby: (userToDeleteId: string, lobbyId: string) => Promise<number>;
  socket: AppSocket;
};
const leaveLobby = ({
  removeUserFromLobby,
  socket,
}: LeaveLobbyDependencies) => async (
  lobbyId: string,
) => {
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

    socket.in(lobbyId).emit('LOBBY_USER_LEAVE', user);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.leave(lobbyId);
    socket.emit('LOBBY_LEAVE');
  } catch (error: unknown) {
    socket.emit('SERVER_ERROR');
  }
};

type JoinLobbyDependencies = {
  addUserToLobby: (userToDeleteId: string, lobbyId: string) => Promise<unknown>;
  getLobby: (lobbyId: string) => Promise<Lobby | undefined>;
  getUsers: (users: string[]) => Promise<(User | ZodError)[]>;
  socket: AppSocket;
};

const joinLobby = ({
  addUserToLobby,
  getLobby,
  getUsers,
  socket,
}: JoinLobbyDependencies) => async (
  lobbyId: string,
) => {
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
    socket.emit('JOINED_ERROR');
  }
};

type HandleLobbyEventsDependencies = {
  removeUserFromLobby: (userToDeleteId: string, lobbyId: string) => Promise<number>;
  addUserToLobby: (currentUserId: string, lobbyId: string) => Promise<unknown>;
  getLobby: (lobbyId: string) => Promise<Lobby | undefined>;
  getUsers: (users: string[]) => Promise<(User | ZodError)[]>;
  socket: AppSocket;
};

export const handleLobbyEvents = (handleLobbyEventsDependencies: HandleLobbyEventsDependencies): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  handleLobbyEventsDependencies.socket.on('joinLobby', joinLobby({
    addUserToLobby: handleLobbyEventsDependencies.addUserToLobby,
    getLobby: handleLobbyEventsDependencies.getLobby,
    getUsers: handleLobbyEventsDependencies.getUsers,
    socket: handleLobbyEventsDependencies.socket,
  }));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  handleLobbyEventsDependencies.socket.on('leaveLobby', leaveLobby({
    removeUserFromLobby: handleLobbyEventsDependencies.removeUserFromLobby,
    socket: handleLobbyEventsDependencies.socket,
  }));
};
