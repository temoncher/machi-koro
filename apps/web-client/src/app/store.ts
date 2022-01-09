import { AxiosInstance } from 'axios';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import {
  createStore,
  compose,
  applyMiddleware,
} from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import * as SocketIOClient from 'socket.io-client';

import { RootAction } from './root.actions';
import { RootApi } from './root.api';
import { rootEpic, RootEpicDependencies } from './root.epic';
import { rootReducer } from './root.reducer';
import { RootState } from './root.state';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

type InitStoreDependencies = {
  history: History<unknown>;
  httpClient: AxiosInstance;
  socket: SocketIOClient.Socket;
};

export const initStore = (deps: InitStoreDependencies) => {
  const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, unknown>();
  const rootApi = RootApi.init({ httpClient: deps.httpClient });

  const store = createStore(
    rootReducer(deps.history),
    composeEnhancers(
      applyMiddleware(
        // `routerMiddleware` has not porperly set up types, therefore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        routerMiddleware(deps.history),
        epicMiddleware,
      ),
    ),
  );

  const rootEpicDependencies: RootEpicDependencies = {
    socket: deps.socket,
    authorize: rootApi.loginApi.sendAuthMeRequest,
    registerGuest: rootApi.loginApi.sendRegisterGuestRequest,
    createLobby: rootApi.lobbyApi.sendCreateLobbyRequest,
    createGame: rootApi.gameApi.sendCreateGameRequest,
    cleanUpAuthToken: () => {
      localStorage.removeItem('token');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
      deps.httpClient.defaults.headers.Authorization = '';
    },
    setAuthToken: (token: string) => {
      localStorage.setItem('token', token);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
      deps.httpClient.defaults.headers.Authorization = `Bearer ${token}`;
    },
  };

  epicMiddleware.run(rootEpic(rootEpicDependencies));

  return store;
};
