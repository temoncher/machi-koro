import { CreateLobbyResponse, ServerError } from '@machikoro/game-server-contracts';
import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { AuthMiddlewareLocals } from '../shared/auth.middleware';
import { HTTPStatusCode } from '../types/HTTPStatusCode.enum';
import { PromisifiedRedisClient } from '../utils/promisifyRedisClient';

type Lobby = {
  lobbyId: string;
  hostId: string;
  users: string[];
};

type CreateLobbyRequestHandler = RequestHandler<
Record<string, string>,
CreateLobbyResponse | ServerError,
Record<string, unknown>,
Record<string, unknown>,
AuthMiddlewareLocals
>;

export type CreateLobbyRequestHandlerDependencies = {
  redisClientLobbies: PromisifiedRedisClient;
};
export const createLobbyRequestHandler = (
  { redisClientLobbies }: CreateLobbyRequestHandlerDependencies,
): CreateLobbyRequestHandler => async (req, res, next) => {
  try {
    const currentUserId = res.locals.currentUser.userId;

    const lobby: Lobby = {
      lobbyId: uuidv4(),
      hostId: currentUserId,
      users: [],
    };

    await Promise.all([
      redisClientLobbies.set(`${lobby.lobbyId}:hostId`, lobby.hostId),
    ]);

    const createLobbyResponse: CreateLobbyResponse = {
      lobbyId: lobby.lobbyId,
    };

    res.status(HTTPStatusCode.CREATED).send(createLobbyResponse);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Something went terribly wrong' });
  }

  next();
};
