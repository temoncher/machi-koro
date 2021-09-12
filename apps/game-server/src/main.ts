import * as http from 'http';
import * as path from 'path';

import * as cors from 'cors';
import * as express from 'express';
import * as redis from 'redis';

import {
  initializeApiRouter,
  RedisDbInstance,
  promisifyRedisClient,
  initSocketServer,
} from './app';

const main = (): void => {
  const PORT = process.env.port || 3333;

  const app = express();
  const server = http.createServer(app);

  const redisClientUsers = redis.createClient({
    host: 'localhost',
    port: 6379,
    db: RedisDbInstance.GUESTS,
  });
  const redisClientLobbies = redis.createClient({
    host: 'localhost',
    port: 6379,
    db: RedisDbInstance.LOBBIES,
  });

  redisClientUsers.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  const promisifiedUsersClient = promisifyRedisClient(redisClientUsers);
  const promisifiedLobbiesClient = promisifyRedisClient(redisClientLobbies);

  app.use(express.json());

  const staticFiles = express.static(path.join(__dirname, 'assets', 'static'));

  app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: [
      'GET',
      'PUT',
      'POST',
      'OPTIONS',
    ],
  }));
  app.use('/static', staticFiles);

  app.use('/api', initializeApiRouter({
    redisClientUsers: promisifiedUsersClient,
    redisClientLobbies: promisifiedLobbiesClient,
  }));

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening at http://localhost:${PORT}/game`);
  });

  // eslint-disable-next-line no-console
  server.on('error', console.error);

  initSocketServer({
    redisClientUsers: promisifiedUsersClient,
    redisClientLobbies: promisifiedLobbiesClient,
  }, server);
};

main();
