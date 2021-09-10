import { promisify } from 'util';

import { RedisClient } from 'redis';

export type PromisifiedRedisClient = {
  set: (key: string, value: string) => Promise<'OK'>;
  get: (key: string) => Promise<string | null>;
  hgetall: (key: string) => Promise<Record<string, string> | null>;
  hset: (keyAndHash: [string, ...string[]]) => Promise<number>;
  expire: (key: string, expireTime: number) => Promise<number>;
  rpush: (key: string, ...val: string[]) => Promise<unknown>;
  lrange: (key: string, from: number, to: number) => Promise<string[] | null>;
  lrem: (key: string, count: number, value: string) => Promise<number>;
};

export const promisifyRedisClient = (redisClient: RedisClient): PromisifiedRedisClient => ({
  set: promisify(redisClient.set.bind(redisClient)),
  get: promisify(redisClient.get.bind(redisClient)),
  hgetall: promisify(redisClient.hgetall.bind(redisClient)),
  hset: promisify(redisClient.hset.bind(redisClient)),
  expire: promisify(redisClient.expire.bind(redisClient)),
  rpush: promisify(redisClient.rpush.bind(redisClient)),
  lrange: promisify(redisClient.lrange.bind(redisClient)),
  lrem: promisify(redisClient.lrem.bind(redisClient)),
});
