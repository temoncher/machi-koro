import { Lobby, LobbyId, UserId } from '@machikoro/game-server-contracts';
import { v4 as uuidv4 } from 'uuid';

import { PromisifiedRedisClient } from '../utils';

export namespace LobbiesRepository {
  type LeaveLobbyAsUser = (userToDeleteId: UserId, lobbyId: LobbyId) => Promise<Error | Lobby>;
  type JoinLobbyAsUser = (currentUserId: UserId, lobbyId: LobbyId,) => Promise<Error | Lobby>;
  type GetLobby = (lobbyId: LobbyId) => Promise<Error | Lobby>;
  type CreateLobby = (hostId: UserId) => Promise<Error | Lobby & { lobbyId: LobbyId }>;

  type LobbiesRepository = {
    leaveUserFromLobby: LeaveLobbyAsUser;
    joinLobbyAsUser: JoinLobbyAsUser;
    getLobby: GetLobby;
    createLobby: CreateLobby;
  };

  const getLobbyHostId = (redisClientLobbies: PromisifiedRedisClient) => async (
    lobbyId: LobbyId,
  ): Promise<string | null> => redisClientLobbies.get(`${lobbyId}:hostId`);
  const getLobbyUsers = (redisClientLobbies: PromisifiedRedisClient) => async (
    lobbyId: LobbyId,
  ): Promise<string[] | null> => redisClientLobbies.lrange(`${lobbyId}:users`, 0, -1);
  const addUserToLobby = (redisClientLobbies: PromisifiedRedisClient) => async (
    userToAdd: UserId,
    lobbyId: LobbyId,
  ): Promise<unknown> => redisClientLobbies.rpush(`${lobbyId}:users`, userToAdd);
  const removeUserFromLobby = (redisClientLobbies: PromisifiedRedisClient) => async (
    userToRemoveId: UserId,
    lobbyId: LobbyId,
  ): Promise<unknown> => redisClientLobbies.lrem(`${lobbyId}:users`, 1, userToRemoveId);

  const initializeGetLobby = (redisClientLobbies: PromisifiedRedisClient): GetLobby => async (
    lobbyId,
  ) => {
    const [hostId, users] = await Promise.all([
      getLobbyHostId(redisClientLobbies)(lobbyId),
      getLobbyUsers(redisClientLobbies)(lobbyId),
    ]);

    if (!hostId) {
      return new Error(`Failed to retrieve lobby(${lobbyId}) host id`);
    }

    if (!users) {
      return new Error(`Failed to retrieve lobby(${lobbyId}) users`);
    }

    return { hostId, users };
  };

  const initializeLeaveLobby = (redisClientLobbies: PromisifiedRedisClient): LeaveLobbyAsUser => async (
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

    await removeUserFromLobby(redisClientLobbies)(userToRemoveId, lobbyId);

    return initializeGetLobby(redisClientLobbies)(lobbyId);
  };

  const initializeJoinLobbyAsUser = (redisClientLobbies: PromisifiedRedisClient): JoinLobbyAsUser => async (
    userToAdd,
    lobbyId,
  ) => {
    const users = await getLobbyUsers(redisClientLobbies)(lobbyId);

    if (!users) {
      return new Error(`Failed to retrieve lobby(${lobbyId}) users`);
    }

    const isUserAlreadyInLobby = users.some((userId) => userId === userToAdd);

    if (!isUserAlreadyInLobby) {
      await addUserToLobby(redisClientLobbies)(userToAdd, lobbyId);
    }

    // TODO: extract magic number into a constant
    if (users.length > 3) {
      return new Error(`The lobby(${lobbyId}) is already full`);
    }

    return initializeGetLobby(redisClientLobbies)(lobbyId);
  };

  const initializeCreateLobby = (redisClientLobbies: PromisifiedRedisClient): CreateLobby => async (
    hostId,
  ) => {
    const lobby: Lobby & { lobbyId: LobbyId } = {
      lobbyId: uuidv4(),
      hostId,
      users: [],
    };

    await redisClientLobbies.set(`${lobby.lobbyId}:hostId`, lobby.hostId);

    return lobby;
  };

  export const init = (redisClientLobbies: PromisifiedRedisClient): LobbiesRepository => ({
    leaveUserFromLobby: initializeLeaveLobby(redisClientLobbies),
    joinLobbyAsUser: initializeJoinLobbyAsUser(redisClientLobbies),
    getLobby: initializeGetLobby(redisClientLobbies),
    createLobby: initializeCreateLobby(redisClientLobbies),
  });
}
