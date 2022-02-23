import { AxiosInstance } from 'axios';
import { routerMiddleware } from 'connected-react-router';
import { Auth } from 'firebase/auth';
import { Database } from 'firebase/database';
import { Firestore } from 'firebase/firestore';
import { History } from 'history';
import {
  createStore,
  compose,
  applyMiddleware,
  AnyAction,
} from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { authState } from 'rxfire/auth';
import {
  of,
  from,
  switchMap,
} from 'rxjs';

import {
  createFirebaseLobby,
  joinFirebaseLobby,
  leaveFirebaseLobby,
} from './firebase/lobbies-firebase.api';
import { getFirebaseUserData, registerFirebaseGuest } from './firebase/users-firebase.api';
import { GameApi } from './game';
import { createLobbyEpic } from './home';
import { joinLobbyEpic, leaveLobbyEpic } from './lobby';
import { registerGuestEpic } from './login';
import { RootAction } from './root.actions';
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
  storage: Storage;
  firebaseAuth: Auth;
  firebaseDb: Database;
  firestore: Firestore;
};

export const initStore = (deps: InitStoreDependencies) => {
  const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, unknown>();
  const gameApi = GameApi.init(deps);

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
    firebaseDb: deps.firebaseDb,
    authState$: authState(deps.firebaseAuth).pipe(
      switchMap((userState) => {
        if (!userState) return of(undefined);

        return from(getFirebaseUserData(deps.firestore)(userState.uid));
      }),
    ),
    createGame: gameApi.sendCreateGameRequest,
  };

  epicMiddleware.run(
    combineEpics<AnyAction, AnyAction, RootState, unknown>(
      rootEpic(rootEpicDependencies),
      registerGuestEpic(registerFirebaseGuest(deps.firestore, deps.firebaseAuth)),
      createLobbyEpic(createFirebaseLobby(deps.firebaseDb)),
      joinLobbyEpic(joinFirebaseLobby(deps.firebaseDb)),
      leaveLobbyEpic(leaveFirebaseLobby(deps.firebaseDb)),
    ),
  );

  return store;
};
