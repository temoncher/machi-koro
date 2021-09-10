import { ServerError, User } from '@machikoro/game-server-contracts';
import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { ExtendedError } from 'socket.io/dist/namespace';
import { ZodError } from 'zod';

import { HTTPStatusCode } from '../types/HTTPStatusCode.enum';
import { AppSocket } from '../types/websocket';
import { PromisifiedRedisClient } from '../utils/promisifyRedisClient';

import { parseUserWithTokenWithoutId } from './user.model';

export type AuthMiddlewareDependencies = {
  redisClientUsers: PromisifiedRedisClient;
};

export type AuthMiddlewareLocals = {
  currentUser: User;
};

type AuthMiddleware = RequestHandler<
Record<string, string>,
ServerError,
Record<string, unknown>,
Record<string, unknown>,
AuthMiddlewareLocals
>;

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export const validateToken = (authorization: string | undefined): string | undefined => {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return undefined;
  }

  const token = extractBearerToken(authorization);

  const payload = jwt.verify(
    token,
    'secret_key',
  );

  if (typeof payload === 'string' || typeof payload.id !== 'string') {
    return undefined;
  }

  return payload.id;
};

export const authMiddleware = (
  { redisClientUsers }: AuthMiddlewareDependencies,
): AuthMiddleware => async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const currentUserId = validateToken(authorization);

    if (!currentUserId) {
      res
        .status(HTTPStatusCode.UNAUTHORIZED)
        .send({ message: 'Invalid token' });

      return;
    }

    const currentUser = await redisClientUsers.hgetall(currentUserId);

    const userOrError = parseUserWithTokenWithoutId(currentUser);

    if (userOrError instanceof ZodError) {
      res
        .status(HTTPStatusCode.UNAUTHORIZED)
        .send({ message: 'User not found' });

      return;
    }

    const user: User = { username: userOrError.username, type: userOrError.type, userId: currentUserId };

    // eslint-disable-next-line no-param-reassign
    res.locals = {
      ...res.locals,
      currentUser: user,
    };
    next();
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Internal server error' });
  }
};

export const authSocketMiddleware = (
  redisClientUsers: PromisifiedRedisClient,
) => async (
  socket: AppSocket,
  next: (error?: ExtendedError) => void,
): Promise<void> => {
  try {
    const { token } = socket.handshake.auth;

    const currentUserId = validateToken(token);

    if (!currentUserId) {
    // TODO: emit error
      return;
    }

    const currentUser = await redisClientUsers.hgetall(currentUserId);

    const userOrError = parseUserWithTokenWithoutId(currentUser);

    if (userOrError instanceof ZodError) {
      // TODO: emit error
      return;
    }

    const user = {
      username: userOrError.username,
      type: userOrError.type,
      userId: currentUserId,
    };

    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unsafe-assignment,  id-denylist
    socket.data = {
      ...socket.data,
      currentUser: user,
    };
    next();
  } catch {
    // TODO: emit error

  }
};
