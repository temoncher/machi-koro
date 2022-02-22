import { AxiosInstance } from 'axios';
import { routerMiddleware } from 'connected-react-router';
import { signInAnonymously, Auth } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { History } from 'history';
import {
  createStore,
  compose,
  applyMiddleware,
} from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { authState } from 'rxfire/auth';
import {
  of,
  from,
  map,
  switchMap,
} from 'rxjs';
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

// eslint-disable-next-line no-restricted-globals
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

type InitStoreDependencies = {
  history: History;
  httpClient: AxiosInstance;
  socket: SocketIOClient.Socket;
  storage: Storage;
  firebaseAuth: Auth;
  firestore: Firestore;
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
    authState$: authState(deps.firebaseAuth).pipe(
      switchMap((userState) => {
        if (!userState) return of(undefined);

        const userDocumentRef = doc(deps.firestore, 'users', userState.uid);

        return from(getDoc(userDocumentRef)).pipe(
          map((userSnapshot) => {
            if (!userSnapshot.exists()) return undefined;

            // TODO: extract this method into service and peform validation
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const user = userSnapshot.data() as { uid: string; username: string };

            return {
              userId: user.uid,
              username: user.username,
            };
          }),
        );
      }),
    ),
    registerGuest: async (username: string) => {
      const anonymusCredentials = await signInAnonymously(deps.firebaseAuth);

      await setDoc(doc(deps.firestore, 'users', anonymusCredentials.user.uid), {
        uid: anonymusCredentials.user.uid,
        username,
        createdAt: serverTimestamp(),
      });

      return {
        userId: anonymusCredentials.user.uid,
        username,
      };
    },
    createLobby: rootApi.lobbyApi.sendCreateLobbyRequest,
    createGame: rootApi.gameApi.sendCreateGameRequest,
  };

  epicMiddleware.run(rootEpic(rootEpicDependencies));

  return store;
};
