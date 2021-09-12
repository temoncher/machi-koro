import { User } from '@machikoro/game-server-contracts';
import { ZodError } from 'zod';

import { PromisifiedRedisClient } from '../utils';

import { parseUserWithTokenWithoutId } from './user.model';

export const getUsers = (
  redisClientUsers: PromisifiedRedisClient,
) => async (
  users: string[],
): Promise<(User | ZodError
  )[]> => {
  const usersRequests = users.map(async (userId) => redisClientUsers.hgetall(userId));
  const usersResponses = await Promise.all(usersRequests);

  const usersOrError = users.map((userId, index) => {
    const cureentUser = usersResponses[index];

    const userOrError = parseUserWithTokenWithoutId(cureentUser);

    if (userOrError instanceof ZodError) {
      return userOrError;
    }

    return {
      userId,
      type: userOrError.type,
      username: userOrError.username,
    } as const;
  });

  return usersOrError;
};
