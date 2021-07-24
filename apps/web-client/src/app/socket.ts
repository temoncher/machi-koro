
import * as SocketIOClient from 'socket.io-client';

let socket: SocketIOClient.Socket;

export const initializeSocket = () => {
  socket = SocketIOClient.io('http://localhost:3333')

  socket.on('connect', () => {
    console.log('connection established')
  })

  socket.on('greet-back', () => {
    console.log('the server greets us back!')
  })
}

export const greet = () => socket?.emit('greeting');
