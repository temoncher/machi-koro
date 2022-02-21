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
  removeUserFromLobby: (userToDeleteId: UserId, lobbyId: LobbyId) => Promise<Error | Lobby>;
  getUser: (userId: UserId) => Promise<User | ZodError>;
  getUsers: (users: UserId[]) => Promise<(User | ZodError)[]>;
  setLobbyHostId: (lobbyId: LobbyId, newHostId: UserId) => Promise<Error | Lobby>;
  deleteLobby: (lobbyId: LobbyId) => Promise<Error | Lobby>;
};

const leaveLobby = (deps: LeaveLobbyDependencies) => (socket: AppSocket) => async (lobbyId: LobbyId) => {
  try {
    // authSocketMiddleware checked and put currentUser object in socket.data
    const { currentUser: { userId, username, type } } = socket.data as AuthMiddlewareLocals;

    const user: User = {
      userId,
      username,
      type,
    };

    const lobbyOrError = await deps.removeUserFromLobby(
      userId,
      lobbyId,
    );

    if (lobbyOrError instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(lobbyOrError.message);

      return;
    }

    // TODO: can be done hooked to the user-left room event?
    const setLobbyHostOrRemoveLobby = async () => {
      if (userId === lobbyOrError.hostId) {
        const newHostId = lobbyOrError.users[0];

        if (newHostId) {
          const [lobby, host] = await Promise.all([
            deps.setLobbyHostId(lobbyId, newHostId),
            deps.getUser(newHostId),
          ]);

          if (host instanceof ZodError) {
            return host;
          }

          socket.in(lobbyId).emit('LOBBY_HOST_CHANGED', { newHost: host, lobbyId });

          return lobby;
        }

        return deps.deleteLobby(lobbyId);
      }

      return lobbyOrError;
    };

    const updatedLobby = await setLobbyHostOrRemoveLobby();

    if (updatedLobby instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(updatedLobby.message);

      return;
    }

    const usersOrErrors = await deps.getUsers(updatedLobby.users);
    const hasErrors = usersOrErrors.some((possibleUser) => possibleUser instanceof ZodError);

    if (hasErrors) {
      // TODO: emit error
      // eslint-disable-next-line no-console
      console.log('there are errors in user requests', usersOrErrors);

      return;
    }

    // This type cast is safe, because we already checked that possibleUsers has no errors inside of it
    const users = usersOrErrors as User[];

    const populatedLobbyState: PopulatedLobbyState = {
      ...updatedLobby,
      users,
    };

    socket.nsp.to(lobbyId).emit('LOBBY_USER_LEFT', { user, lobbyId });
    // TODO: make these commands reactive with (room events)[https://socket.io/docs/v3/rooms/#room-events]
    socket.emit('LOBBY_LEFT_SUCCESSFULLY', lobbyId);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.leave(lobbyId);
    socket.nsp.to(lobbyId).emit('LOBBY_STATE_UPDATED', populatedLobbyState);

    // eslint-disable-next-line no-console
    console.log(`user(${username}:${userId}) left the lobby(${lobbyId})`);
  } catch (error: unknown) {
    socket.emit('LOBBY_LEAVE_ERROR');

    // eslint-disable-next-line no-console
    console.error('leave lobby error: ', error);
  }
};

type JoinLobbyDependencies = {
  addUserToLobby: (userToDeleteId: UserId, lobbyId: LobbyId) => Promise<Error | Lobby>;
  getUsers: (users: UserId[]) => Promise<(User | ZodError)[]>;
};

const joinLobby = ({
  addUserToLobby,
  getUsers,
}: JoinLobbyDependencies) => (socket: AppSocket) => async (lobbyId: LobbyId) => {
  try {
    // authSocketMiddleware checked and put currentUser object in socket.data
    const { currentUser: { userId, type, username } } = socket.data as AuthMiddlewareLocals;

    const lobbyOrError = await addUserToLobby(userId, lobbyId);

    if (lobbyOrError instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(lobbyOrError.message);
      socket.emit('LOBBY_JOIN_ERROR', lobbyOrError.message);

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
    socket.emit('LOBBY_JOIN_ERROR', 'Server error');
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
