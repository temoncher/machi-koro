/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as SocketIO from 'socket.io'
import * as http from 'http';

const PORT = process.env.port || 3333;

const app = express();
const server = http.createServer(app);
const io = new SocketIO.Server(server, { cors: { origin: '*' }});

app.get('/game', (req, res) => {
  res.send({ message: 'Welcome to game-server!' });
});

server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/game`);
});

server.on('error', console.error);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('greeting', () => {
    console.log(`socket by id ${socket.id} greets us!`);

    socket.emit('greet-back');
  })
});
