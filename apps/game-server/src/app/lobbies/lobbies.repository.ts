import { Lobby } from '@machikoro/game-server-contracts';

import { PromisifiedRedisClient } from '../utils';

export namespace LobbyRepository {

  type RemoveUserFromLobby = (userToDeleteId: string, lobbyId: string) => Promise<number>;
  type AddUserToLobby = (currentUserId: string, lobbyId: string,) => Promise<unknown>;
  type GetLobby = (lobbyId: string) => Promise<Lobby | undefined>;

  export type LobbyRepository = {
    removeUserFromLobby: RemoveUserFromLobby;
    addUserToLobby: AddUserToLobby;
    getLobby: GetLobby;
  };

  export const initializeRemoveUserFromLobby = (redisClientLobbies: PromisifiedRedisClient): RemoveUserFromLobby => async (
    userToDeleteId: string,
    lobbyId: string,
  ): Promise<number> => redisClientLobbies.lrem(`${lobbyId}:users`, 1, userToDeleteId);

  export const initializeAddUserToLobby = (redisClientLobbies: PromisifiedRedisClient) => async (
    currentUserId: string,
    lobbyId: string,
  ): Promise<unknown> => redisClientLobbies.rpush(`${lobbyId}:users`, currentUserId);

  export const initializeGetLobby = (
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

  export const init = (redisClientLobbies: PromisifiedRedisClient): LobbyRepository => ({
    removeUserFromLobby: initializeRemoveUserFromLobby(redisClientLobbies),
    addUserToLobby: initializeAddUserToLobby(redisClientLobbies),
    getLobby: initializeGetLobby(redisClientLobbies),
  });
}
