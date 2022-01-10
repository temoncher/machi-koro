import * as http from 'http';
import * as path from 'path';

import * as cors from 'cors';
import * as express from 'express';
import * as redis from 'redis';

import {
  initializeAppRouter,
  LobbiesRepository,
  RedisDbInstance,
  promisifyRedisClient,
  initSocketServer,
  AppRouterDependencies,
  SocketServerDependencies,
} from './app';
import { GameRepository } from './app/games';
import { UsersRepository } from './app/shared';

const main = (): void => {
  const PORT = process.env.port || 3333;
  const CLIENT_PORT = 4200;
  const hosts = process.env.DEVCONTAINER
    ? {
      REDIS: 'redis',
      MAIN: '127.0.0.1',
    }
    : {
      REDIS: 'localhost',
      MAIN: 'localhost',
    };

  const app = express();
  const server = http.createServer(app);

  const redisClientUsers = redis.createClient({
    host: hosts.REDIS,
    port: 6379,
    db: RedisDbInstance.GUESTS,
  });
  const redisClientLobbies = redis.createClient({
    host: hosts.REDIS,
    port: 6379,
    db: RedisDbInstance.LOBBIES,
  });
  const redisClientGames = redis.createClient({
    host: hosts.REDIS,
    port: 6379,
    db: RedisDbInstance.GAMES,
  });

  redisClientUsers.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  const lobbiesRepository = LobbiesRepository.init(promisifyRedisClient(redisClientLobbies));
  const usersRepository = UsersRepository.init(promisifyRedisClient(redisClientUsers));
  const gamesRepository = GameRepository.init(promisifyRedisClient(redisClientGames));

  app.use(express.json());

  const staticFiles = express.static(path.join(__dirname, 'assets', 'static'));

  app.use(cors({
    origin: `http://${hosts.MAIN}:${CLIENT_PORT}`,
    credentials: true,
    methods: [
      'GET',
      'PUT',
      'POST',
      'OPTIONS',
    ],
  }));
  app.use('/static', staticFiles);

  const socketServerDependencies: SocketServerDependencies = {
    leaveLobbyAsUser: lobbiesRepository.leaveUserFromLobby,
    joinLobbyAsUser: lobbiesRepository.joinLobbyAsUser,
    getUsers: usersRepository.getUsers,
    getUser: usersRepository.getUser,
    getGame: gamesRepository.getGame,
    connectUserToGame: gamesRepository.connectUserToGame,
    disconnectUserFromGame: gamesRepository.disconnectUserFromGame,
  };

  const socketServerConfig = {
    cors: {
      origin: `http://${hosts.MAIN}:${CLIENT_PORT}`,
      credentials: true,
      methods: [
        'GET',
        'PUT',
        'POST',
        'OPTIONS',
      ],
    },
  };

  const io = initSocketServer(socketServerConfig, socketServerDependencies, server);

  const appRouterDependencies: AppRouterDependencies = {
    getUser: usersRepository.getUser,
    createUser: usersRepository.createUser,
    createLobby: lobbiesRepository.createLobby,
    getLobby: lobbiesRepository.getLobby,
    createGame: gamesRepository.createGame,
    dispatchGameCreatedEvent: ({ lobbyId, gameId }) => {
      io.to(lobbyId).emit('LOBBY_GAME_CREATED', gameId);
    },
  };

  app.use('/api', initializeAppRouter(appRouterDependencies));

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening at http://${hosts.MAIN}:${PORT}/`);
  });

  // eslint-disable-next-line no-console
  server.on('error', console.error);
};

main();
