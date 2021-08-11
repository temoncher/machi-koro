import * as http from 'http';
import * as path from 'path';

import * as express from 'express';
import * as redis from 'redis';
import * as SocketIO from 'socket.io';

import { initializeAuthRouter } from './app/auth/auth.router';
import { initListeners } from './websocket';

const main = (): void => {
  const PORT = process.env.port || 3333;

  const app = express();
  const server = http.createServer(app);
  const io = new SocketIO.Server(server, { cors: { origin: '*' } });

  const redisClientUsers = redis.createClient({
    host: 'localhost',
    port: 6379,
  });

  redisClientUsers.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  app.use(express.json());

  const staticFiles = express.static(path.join(__dirname, 'assets', 'static'));

  app.use('/static', staticFiles);

  app.use('/api', initializeAuthRouter(redisClientUsers));
  app.get('/game', (req, res) => {
    res.send({ message: 'Welcome to game-server!' });
  });

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening at http://localhost:${PORT}/game`);
  });

  // eslint-disable-next-line no-console
  server.on('error', console.error);

  initListeners(io);
};

main();
