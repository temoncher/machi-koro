import {
  CreateGameRequestBody,
  CreateGameResponse,
  Game,
  Lobby,
  ServerError,
  UsersStatusesMap,
  UserStatus,
  validateLobby,
} from '@machikoro/game-server-contracts';
import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { AuthMiddlewareLocals } from '../shared';
import { HTTPStatusCode } from '../types';
import { PromisifiedRedisClient } from '../utils';

type CreateGameRequestHandler = RequestHandler<
Record<string, string>,
CreateGameResponse | ServerError,
CreateGameRequestBody,
Record<string, unknown>,
AuthMiddlewareLocals
>;

export type CreateGameRequestHandlerDependencies = {
  redisClientGames: PromisifiedRedisClient;
  getLobby: (lobbyId: string) => Promise<Lobby | undefined>;
};

export const createGameRequestHandler = (
  { redisClientGames, getLobby }: CreateGameRequestHandlerDependencies,
): CreateGameRequestHandler => async (req, res, next) => {
  try {
    const currentUserId = res.locals.currentUser.userId;
    const { lobbyId } = req.body;

    const lobby = await getLobby(lobbyId);

    const lobbyOrError = validateLobby(lobby);

    if (!lobbyOrError) {
      // TODO: emit error
      return;
    }

    const usersStatusesMap: UsersStatusesMap = Object.fromEntries(lobbyOrError.users.map((userId) => [userId, UserStatus.DISCONNECTED]));
    const game: Game = {
      gameId: uuidv4(),
      hostId: currentUserId,
      users: lobbyOrError.users,
      usersStatuses: usersStatusesMap,
    };

    const usersHash = Object.entries(game.users).flat();

    const usersStatuses = Object.entries(usersStatusesMap).flat();

    await Promise.all([
      redisClientGames.set(`${game.gameId}:hostId`, game.hostId),
      redisClientGames.rpush(`${game.gameId}:users`, ...usersHash),
      redisClientGames.hset([`${game.gameId}:usersStatuses`, ...usersStatuses]),
    ]);

    const gamesResponse: CreateGameResponse = {
      gameId: game.gameId,
    };

    res.send(gamesResponse);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Something went terribly wrong' });
  }

  next();
};
