import { AuthResponse, ServerError, RegisterGuestRequestBody } from '@machikoro/game-server-contracts';
import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { EXPIRE_JWT_TIME_1D, EXPIRE_TIME_1D } from '../constants';
import { UserWithTokenWithoutId } from '../shared/user.model';
import { HTTPStatusCode } from '../types/HTTPStatusCode.enum';
import { PromisifiedRedisClient } from '../utils/promisifyRedisClient';

type RegisterGuestRequestHandler = RequestHandler<
Record<string, string>,
AuthResponse | ServerError,
RegisterGuestRequestBody
>;

export type RegisterGuestRequestHandlerDependencies = { redisClientUsers: PromisifiedRedisClient };
export const registerGuestRequestHandler = (
  { redisClientUsers }: RegisterGuestRequestHandlerDependencies,
): RegisterGuestRequestHandler => async (req, res, next) => {
  try {
    const { type, username } = req.body;

    const id = uuidv4();
    const token = jwt.sign({ id }, 'secret_key', {
      expiresIn: EXPIRE_JWT_TIME_1D,
    });
    const user: UserWithTokenWithoutId = { username, token, type };
    const userHash = Object.entries(user).flat();

    await redisClientUsers.hset([id, ...userHash]);
    await redisClientUsers.expire(id, EXPIRE_TIME_1D);

    const authResponse: AuthResponse = {
      username,
      id,
      token,
    };

    res.status(HTTPStatusCode.CREATED).send(authResponse);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Internal Server Error' });
  }

  next();
};
