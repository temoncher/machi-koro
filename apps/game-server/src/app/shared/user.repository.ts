import { User, UserWithToken } from '@machikoro/game-server-contracts';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';

import { EXPIRE_JWT_TIME_1D, EXPIRE_TIME_1D } from '../constants';
import { PromisifiedRedisClient } from '../utils';

import { parseUserWithTokenWithoutId, UserWithTokenWithoutId } from './user.model';

export namespace UsersRepository {
  type GetUser = (userId: string) => Promise<User | ZodError>;
  type GetUsers = (users: string[]) => Promise<(User | ZodError)[]>;
  type CreateUser = ({ username, type }: Pick<User, 'username' | 'type'>) => Promise<UserWithToken>;

  type UsersRepository = {
    getUser: GetUser;
    getUsers: GetUsers;
    createUser: CreateUser;
  };
  const initializeGetUser = (redisClientUsers: PromisifiedRedisClient): GetUser => async (userId) => {
    const user = await redisClientUsers.hgetall(userId);

    const userOrError = parseUserWithTokenWithoutId(user);

    if (userOrError instanceof ZodError) {
      return userOrError;
    }

    return {
      userId,
      type: userOrError.type,
      username: userOrError.username,
    } as const;
  };

  const initializeGetUsers = (redisClientUsers: PromisifiedRedisClient): GetUsers => async (users) => {
    const getUser = initializeGetUser(redisClientUsers);

    const usersRequests = users.map(async (userId) => getUser(userId));

    return Promise.all(usersRequests);
  };

  const initializeCreateUser = (redisClientUsers: PromisifiedRedisClient): CreateUser => async ({ username, type }) => {
    const userId = uuidv4();
    const token = jwt.sign({ id: userId }, 'secret_key', {
      expiresIn: EXPIRE_JWT_TIME_1D,
    });
    const user: UserWithTokenWithoutId = { username, token, type };
    const userHash = Object.entries(user).flat();

    await redisClientUsers.hset([userId, ...userHash]);
    await redisClientUsers.expire(userId, EXPIRE_TIME_1D);

    return {
      ...user,
      userId,
    };
  };

  export const init = (redisClientUsers: PromisifiedRedisClient): UsersRepository => ({
    getUser: initializeGetUser(redisClientUsers),
    getUsers: initializeGetUsers(redisClientUsers),
    createUser: initializeCreateUser(redisClientUsers),
  });
}
