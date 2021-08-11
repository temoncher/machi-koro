import { ClientSentEventsMap, ServerSentEventsMap } from '@machikoro/game-server-contracts/websocket-messages';
import * as SocketIO from 'socket.io';

import { ServerSideEventsMap } from './types/server-side-events';

const onConnection = (socket: SocketIO.Socket<ClientSentEventsMap, ServerSentEventsMap, ServerSideEventsMap>): void => {
  // eslint-disable-next-line no-console
  console.log('a user connected', socket.id);

  socket.on('greeting', () => {
    // eslint-disable-next-line no-console
    console.log(`socket by id ${socket.id} greets us!`);

    socket.emit('greet-back');
  });
};

export const initListeners = (io: SocketIO.Server<ClientSentEventsMap, ServerSentEventsMap, ServerSideEventsMap>): void => {
  io.on('connection', onConnection);
};
