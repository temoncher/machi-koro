import { promisify } from 'util';

import { RedisClient } from 'redis';

type PromisifiedRedisClient = {
  get: (key: string) => Promise<string | null>;
  hset: (keyAndHash: [string, ...string[]]) => Promise<number>;
  expire: (key: string, expireTime: number) => Promise<number>;
};

export const promisifyRedisClient = (redisClient: RedisClient): PromisifiedRedisClient => ({
  get: promisify(redisClient.get.bind(redisClient)),
  hset: promisify(redisClient.hset.bind(redisClient)),
  expire: promisify(redisClient.expire.bind(redisClient)),
});
