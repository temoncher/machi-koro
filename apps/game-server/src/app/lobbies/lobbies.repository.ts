import { Lobby } from '@machikoro/game-server-contracts';
import { v4 as uuidv4 } from 'uuid';

import { PromisifiedRedisClient } from '../utils';

export namespace LobbiesRepository {

  type RemoveUserFromLobby = (userToDeleteId: string, lobbyId: string) => Promise<number>;
  type AddUserToLobby = (currentUserId: string, lobbyId: string,) => Promise<unknown>;
  type GetLobby = (lobbyId: string) => Promise<Lobby | undefined>;
  type CreateLobby = (hostId: string) => Promise<Lobby & { lobbyId: string } | undefined>;

  type LobbiesRepository = {
    removeUserFromLobby: RemoveUserFromLobby;
    addUserToLobby: AddUserToLobby;
    getLobby: GetLobby;
    createLobby: CreateLobby;
  };

  const initializeRemoveUserFromLobby = (redisClientLobbies: PromisifiedRedisClient): RemoveUserFromLobby => async (
    userToDeleteId: string,
    lobbyId: string,
  ): Promise<number> => redisClientLobbies.lrem(`${lobbyId}:users`, 1, userToDeleteId);

  const initializeAddUserToLobby = (redisClientLobbies: PromisifiedRedisClient) => async (
    currentUserId: string,
    lobbyId: string,
  ): Promise<unknown> => redisClientLobbies.rpush(`${lobbyId}:users`, currentUserId);

  const initializeGetLobby = (
    redisClientLobbies: PromisifiedRedisClient,
  ) => async (
    lobbyId: string,
  ): Promise<Lobby | undefined> => {
    const [hostId, users] = await Promise.all([
      redisClientLobbies.get(`${lobbyId}:hostId`), redisClientLobbies.lrange(`${lobbyId}:users`, 0, -1),
    ]);

    if (!hostId || !users) {
      return undefined;
    }

    return { hostId, users };
  };

  const initializeCreateLobby = (
    redisClientLobbies: PromisifiedRedisClient,
  ): CreateLobby => async (hostId) => {
    const lobby: Lobby & { lobbyId: string } = {
      lobbyId: uuidv4(),
      hostId,
      users: [],
    };

    await redisClientLobbies.set(`${lobby.lobbyId}:hostId`, lobby.hostId);

    return lobby;
  };

  export const init = (redisClientLobbies: PromisifiedRedisClient): LobbiesRepository => ({
    removeUserFromLobby: initializeRemoveUserFromLobby(redisClientLobbies),
    addUserToLobby: initializeAddUserToLobby(redisClientLobbies),
    getLobby: initializeGetLobby(redisClientLobbies),
    createLobby: initializeCreateLobby(redisClientLobbies),
  });
}
