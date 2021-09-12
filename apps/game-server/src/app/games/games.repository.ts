import {
  Game,
  UsersStatusesMap,
  UserStatus,
} from '@machikoro/game-server-contracts';

import { PromisifiedRedisClient } from '../utils';

export namespace GameRepository {

  type AddUsersToGame = (usersIds: string[], gameId: string,) => Promise<unknown>;
  type DisconnectUserFromGame = (userToDisconnectId: string, gameId: string) => Promise<'OK'>;
  type ConnectUserToGame = (userToConnectId: string, gameId: string,) => Promise<'OK'>;
  type GetGame = (gameId: string) => Promise<Game | undefined>;

  export type GameRepository = {
    addUsersToGame: AddUsersToGame;
    disconnectUserFromGame: DisconnectUserFromGame;
    connectUserToGame: ConnectUserToGame;
    getGame: GetGame;
  };

  const initializeAddUsersToGame = (redisClientGames: PromisifiedRedisClient): AddUsersToGame => async (
    usersIds: string[],
    gameId: string,
  ): Promise<unknown> => redisClientGames.rpush(`${gameId}:users`, ...usersIds);

  const initializeDisconnectUserFromGame = (redisClientGames: PromisifiedRedisClient): DisconnectUserFromGame => async (
    userToDisconnectId: string,
    gameId: string,
  ): Promise<'OK'> => redisClientGames.hmset([
    `${gameId}:usersStatuses`,
    userToDisconnectId,
    UserStatus.DISCONNECTED,
  ]);

  const initializeConnectUserToGame = (redisClientGames: PromisifiedRedisClient): ConnectUserToGame => async (
    userToConnectId: string,
    gameId: string,
  ): Promise<'OK'> => redisClientGames.hmset([
    `${gameId}:usersStatuses`,
    userToConnectId,
    UserStatus.CONNECTED,
  ]);

  const initializeGetGame = (
    redisClientGames: PromisifiedRedisClient,
  ): GetGame => async (
    gameId: string,
  ): Promise<Game | undefined> => {
    const [
      hostId,
      users,
      usersStatuses,
    ] = await Promise.all([
      redisClientGames.get(`${gameId}:hostId`),
      redisClientGames.lrange(`${gameId}:users`, 0, -1),
      redisClientGames.hgetall(`${gameId}:usersStatuses`),
    ]);

    if (!hostId || !users || !usersStatuses) {
      return undefined;
    }

    const usersStatusesMap = usersStatuses as UsersStatusesMap;

    return {
      gameId,
      hostId,
      users,
      usersStatuses: usersStatusesMap,
    };
  };

  export const init = (redisClientGames: PromisifiedRedisClient): GameRepository => ({
    addUsersToGame: initializeAddUsersToGame(redisClientGames),
    disconnectUserFromGame: initializeDisconnectUserFromGame(redisClientGames),
    connectUserToGame: initializeConnectUserToGame(redisClientGames),
    getGame: initializeGetGame(redisClientGames),
  });
}
