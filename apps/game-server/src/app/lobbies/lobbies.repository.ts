import { Lobby, LobbyId, UserId } from '@machikoro/game-server-contracts';
import { v4 as uuidv4 } from 'uuid';

import { PromisifiedRedisClient } from '../utils';

export namespace LobbiesRepository {
  type SetLobbyHostId = (lobbyId: LobbyId, hostId: UserId) => Promise<Error | Lobby>;
  type RemoveUserFromLobby = (userToDeleteId: UserId, lobbyId: LobbyId) => Promise<Error | Lobby>;
  type AddUserToLobby = (currentUserId: UserId, lobbyId: LobbyId,) => Promise<Error | Lobby>;
  type GetLobby = (lobbyId: LobbyId) => Promise<Error | Lobby>;
  type CreateLobby = (payload: { hostId: UserId; capacity: number }) => Promise<Error | Lobby & { lobbyId: LobbyId }>;
  type DeleteLobby = (lobbyId: LobbyId) => Promise<Error | Lobby>;

  type LobbiesRepository = {
    setLobbyHostId: SetLobbyHostId;
    removeUserFromLobby: RemoveUserFromLobby;
    addUserToLobby: AddUserToLobby;
    getLobby: GetLobby;
    createLobby: CreateLobby;
    deleteLobby: DeleteLobby;
  };

  const getLobbyHostId = (redisClientLobbies: PromisifiedRedisClient) => async (
    lobbyId: LobbyId,
  ): Promise<string | null> => redisClientLobbies.get(`${lobbyId}:hostId`);
  const getLobbyCapacity = (redisClientLobbies: PromisifiedRedisClient) => async (
    lobbyId: LobbyId,
  ): Promise<Error | number | null> => {
    const capacityString = await redisClientLobbies.get(`${lobbyId}:capacity`);

    if (!capacityString) {
      return null;
    }

    try {
      const capacity = parseInt(capacityString, 10);

      return capacity;
    } catch {
      return new Error(`Failed to parse lobby(${lobbyId}) capacity`);
    }
  };
  const getLobbyUsers = (redisClientLobbies: PromisifiedRedisClient) => async (
    lobbyId: LobbyId,
  ): Promise<string[] | null> => redisClientLobbies.lrange(`${lobbyId}:users`, 0, -1);
  const addUserToLobbyUsers = (redisClientLobbies: PromisifiedRedisClient) => async (
    userToAdd: UserId,
    lobbyId: LobbyId,
  ): Promise<unknown> => redisClientLobbies.rpush(`${lobbyId}:users`, userToAdd);
  const deleteUserFromLobbyUsers = (redisClientLobbies: PromisifiedRedisClient) => async (
    userToRemoveId: UserId,
    lobbyId: LobbyId,
  ): Promise<unknown> => redisClientLobbies.lrem(`${lobbyId}:users`, 1, userToRemoveId);

  const getLobby = (redisClientLobbies: PromisifiedRedisClient): GetLobby => async (
    lobbyId,
  ) => {
    const [hostId, users, capacity] = await Promise.all([
      getLobbyHostId(redisClientLobbies)(lobbyId),
      getLobbyUsers(redisClientLobbies)(lobbyId),
      getLobbyCapacity(redisClientLobbies)(lobbyId),
    ]);

    if (!hostId) {
      return new Error(`Failed to retrieve lobby(${lobbyId}) host id`);
    }

    if (!users) {
      return new Error(`Failed to retrieve lobby(${lobbyId}) users`);
    }

    if (!capacity) {
      return new Error(`Failed to retrieve lobby(${lobbyId}) capacity`);
    }

    if (capacity instanceof Error) {
      return capacity;
    }

    return {
      hostId,
      users,
      capacity,
    };
  };
  const setLobbyHostId = (redisClientLobbies: PromisifiedRedisClient): SetLobbyHostId => async (
    lobbyId,
    hostId,
  ) => {
    await redisClientLobbies.set(`${lobbyId}:hostId`, hostId);

    return getLobby(redisClientLobbies)(lobbyId);
  };

  const deleteLobby = (redisClientLobbies: PromisifiedRedisClient): DeleteLobby => async (lobbyId) => {
    const lobby = await getLobby(redisClientLobbies)(lobbyId);

    await redisClientLobbies.del([
      `${lobbyId}:capacity`,
      `${lobbyId}:hostId`,
      `${lobbyId}:users`,
    ]);

    return lobby;
  };

  const removeUserFromLobby = (redisClientLobbies: PromisifiedRedisClient): RemoveUserFromLobby => async (
    userToRemoveId,
    lobbyId,
  ) => {
    const users = await getLobbyUsers(redisClientLobbies)(lobbyId);

    if (!users) {
      return new Error(`Failed to retrieve lobby(${lobbyId}) users`);
    }

    const isUserInLobby = users.some((userId) => userId === userToRemoveId);

    if (!isUserInLobby) {
      return new Error(`User(${userToRemoveId}) is not in a lobby(${lobbyId})`);
    }

    await deleteUserFromLobbyUsers(redisClientLobbies)(userToRemoveId, lobbyId);

    return getLobby(redisClientLobbies)(lobbyId);
  };

  const addUserToLobby = (redisClientLobbies: PromisifiedRedisClient): AddUserToLobby => async (
    userToAdd,
    lobbyId,
  ) => {
    const lobby = await getLobby(redisClientLobbies)(lobbyId);

    if (lobby instanceof Error) {
      return lobby;
    }

    const isUserAlreadyInLobby = lobby.users.some((userId) => userId === userToAdd);

    if (!isUserAlreadyInLobby) {
      if (lobby.users.length + 1 > lobby.capacity) {
        return new Error(`The lobby(${lobbyId}) is already full`);
      }

      await addUserToLobbyUsers(redisClientLobbies)(userToAdd, lobbyId);
    }

    return getLobby(redisClientLobbies)(lobbyId);
  };

  const createLobby = (redisClientLobbies: PromisifiedRedisClient): CreateLobby => async ({
    hostId,
    capacity,
  }) => {
    const lobby: Lobby & { lobbyId: LobbyId } = {
      lobbyId: uuidv4(),
      hostId,
      capacity,
      users: [],
    };

    await Promise.all([
      setLobbyHostId(redisClientLobbies)(lobby.lobbyId, hostId),
      redisClientLobbies.set(`${lobby.lobbyId}:capacity`, String(lobby.capacity)),
    ]);

    return lobby;
  };

  export const init = (redisClientLobbies: PromisifiedRedisClient): LobbiesRepository => ({
    setLobbyHostId: setLobbyHostId(redisClientLobbies),
    removeUserFromLobby: removeUserFromLobby(redisClientLobbies),
    addUserToLobby: addUserToLobby(redisClientLobbies),
    getLobby: getLobby(redisClientLobbies),
    createLobby: createLobby(redisClientLobbies),
    deleteLobby: deleteLobby(redisClientLobbies),
  });
}
