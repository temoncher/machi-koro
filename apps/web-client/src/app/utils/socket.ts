import * as SocketIOClient from 'socket.io-client';

export const initSocketConnection = (url: string, getToken: () => string | undefined) => {
  const token = getToken();

  return SocketIOClient.io(url, {
    auth: {
      token,
    },
  });
};
