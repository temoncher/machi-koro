import * as SocketIOClient from 'socket.io-client';

let socket: SocketIOClient.Socket | undefined;

export const initializeSocket = () => {
  socket = SocketIOClient.io('http://localhost:3333');

  socket.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('connection established');
  });

  socket.on('greet-back', () => {
    // eslint-disable-next-line no-console
    console.log('the server greets us back!');
  });
};

export const greet = () => socket?.emit('greeting');
