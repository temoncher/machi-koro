import { Response, NextFunction, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { RedisClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

import { HTTPStatusCode } from '../common/HTTPStatusCode.enum';
import { EXPIRE_TIME_1D } from '../common/constants';
import { promisifyRedisClient } from '../utils/promisifyRedisClient';

import { AuthRequestBody } from './authRequestBody.schema';

type User = Record<string, string>;
type AuthResponse = {
  nickname: string;
  id: string;
};

export const authController = (redisClientUsers: RedisClient): RequestHandler => async (
  req: AuthRequestBody,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { type, nickname } = req.body;

  try {
    const id = uuidv4();
    const token = jwt.sign({ id }, 'secret_key', {
      expiresIn: String(EXPIRE_TIME_1D),
    });

    const user: User = { nickname, token, type };
    const hashUser = Object.entries(user).flat();

    const promisifiedRedisClient = promisifyRedisClient(redisClientUsers);

    await promisifiedRedisClient.hset([id, ...hashUser]);
    await promisifiedRedisClient.expire(id, EXPIRE_TIME_1D);

    const authResponse: AuthResponse = {
      nickname,
      id,
    };

    res.clearCookie('authorization');
    res.cookie('authorization', token, {
      maxAge: EXPIRE_TIME_1D,
      httpOnly: true,
    }).send(authResponse);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Internal Server Error' });
  }

  next();
};
