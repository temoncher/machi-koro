import {
  GameId,
  Game,
  UsersStatusesMap,
  UserStatus,
  UserId,
} from '@machikoro/game-server-contracts';
import { v4 as uuidv4 } from 'uuid';

import { PromisifiedRedisClient } from '../utils';

export namespace GameRepository {

  type AddUsersToGame = (usersIds: UserId[], gameId: GameId,) => Promise<unknown>;
  type DisconnectUserFromGame = (userToDisconnectId: UserId, gameId: GameId) => Promise<'OK'>;
  type ConnectUserToGame = (userToConnectId: UserId, gameId: GameId,) => Promise<'OK'>;
  type GetGame = (gameId: GameId) => Promise<Game | undefined>;
  type CreateGame = (currentUserId: UserId, users: UserId[]) => Promise<Game>;

  export type GameRepository = {
    addUsersToGame: AddUsersToGame;
    disconnectUserFromGame: DisconnectUserFromGame;
    connectUserToGame: ConnectUserToGame;
    getGame: GetGame;
    createGame: CreateGame;
  };

  const initializeAddUsersToGame = (redisClientGames: PromisifiedRedisClient): AddUsersToGame => async (
    usersIds: UserId[],
    gameId: GameId,
  ): Promise<unknown> => redisClientGames.rpush(`${gameId}:users`, ...usersIds);

  const initializeDisconnectUserFromGame = (redisClientGames: PromisifiedRedisClient): DisconnectUserFromGame => async (
    userToDisconnectId: UserId,
    gameId: GameId,
  ): Promise<'OK'> => redisClientGames.hmset([
    `${gameId}:usersStatusesMap`,
    userToDisconnectId,
    UserStatus.DISCONNECTED,
  ]);

  const initializeConnectUserToGame = (redisClientGames: PromisifiedRedisClient): ConnectUserToGame => async (
    userToConnectId: UserId,
    gameId: GameId,
  ): Promise<'OK'> => redisClientGames.hmset([
    `${gameId}:usersStatusesMap`,
    userToConnectId,
    UserStatus.CONNECTED,
  ]);

  const initializeGetGame = (
    redisClientGames: PromisifiedRedisClient,
  ): GetGame => async (
    gameId: GameId,
  ): Promise<Game | undefined> => {
    const [
      hostId,
      users,
      userStatusesMap,
    ] = await Promise.all([
      redisClientGames.get(`${gameId}:hostId`),
      redisClientGames.lrange(`${gameId}:users`, 0, -1),
      redisClientGames.hgetall(`${gameId}:usersStatusesMap`),
    ]);

    if (!hostId || !users || !userStatusesMap) {
      // TODO: emit error
      return undefined;
    }

    const usersStatusesMap = userStatusesMap as UsersStatusesMap;

    return {
      gameId,
      hostId,
      users,
      usersStatusesMap,
    };
  };

  const initializeCreateGame = (
    redisClientGames: PromisifiedRedisClient,
  ): CreateGame => async (currentUserId: UserId, users: UserId[]) => {
    const usersStatusesMap: UsersStatusesMap = Object.fromEntries(users.map((userId) => [userId, UserStatus.DISCONNECTED]));

    const game: Game = {
      gameId: uuidv4(),
      hostId: currentUserId,
      users,
      usersStatusesMap,
    };

    const usersStatusesMapHash = Object.entries(usersStatusesMap).flat();

    await Promise.all([
      redisClientGames.set(`${game.gameId}:hostId`, game.hostId),
      redisClientGames.rpush(`${game.gameId}:users`, ...users),
      redisClientGames.hset([`${game.gameId}:usersStatusesMap`, ...usersStatusesMapHash]),
    ]);

    return game;
  };

  export const init = (redisClientGames: PromisifiedRedisClient): GameRepository => ({
    addUsersToGame: initializeAddUsersToGame(redisClientGames),
    disconnectUserFromGame: initializeDisconnectUserFromGame(redisClientGames),
    connectUserToGame: initializeConnectUserToGame(redisClientGames),
    getGame: initializeGetGame(redisClientGames),
    createGame: initializeCreateGame(redisClientGames),
  });
}
