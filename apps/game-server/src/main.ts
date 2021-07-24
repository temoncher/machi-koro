import * as http from 'http';

import * as express from 'express';
import * as SocketIO from 'socket.io';

import { initListeners } from './websocket';

const PORT = process.env.port || 3333;

const app = express();
const server = http.createServer(app);
const io = new SocketIO.Server(server, { cors: { origin: '*' } });

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
