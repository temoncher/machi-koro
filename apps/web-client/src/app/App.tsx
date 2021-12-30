import React, { useContext } from 'react';
import { ReactReduxContext, ReactReduxContextValue, useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import {
  GuardProvider,
  GuardedRoute,
  Next,
} from 'react-router-guards';
import './App.css';
import { GuardFunctionRouteProps, GuardToRoute } from 'react-router-guards/dist/types';
import { Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { GamePage } from './game';
import { HomePage } from './home';
import { Header } from './layout';
import { Loading } from './loading';
import { LobbyPage } from './lobby';
import { getUserData, LoginPage } from './login';
import { RootAction } from './root.actions';
import { RootApiType } from './root.api.type';
import { RootState } from './root.state';

const createRequireUnauthorized = (
  store: Store<RootState, RootAction>,
  dispatch: ThunkDispatch<RootState, RootApiType.RootApi, RootAction>,
) => async (
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
  next: Next,
): Promise<void> => {
  // TODO: refactor the guard to not depend on dispatch returning a promise
  // eslint-disable-next-line @typescript-eslint/await-thenable
  await dispatch(getUserData());

  const { username } = store.getState().loginReducer;

  if (username !== '') {
    next.redirect('/');
  } else {
    next();
  }
};

const createRequireAuthorized = (
  store: Store<RootState, RootAction>,
  dispatch: ThunkDispatch<RootState, RootApiType.RootApi, RootAction>,
) => async (
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
  next: Next,
): Promise<void> => {
  // TODO: refactor the guard to not depend on dispatch returning a promise
  // eslint-disable-next-line @typescript-eslint/await-thenable
  await dispatch(getUserData());

  const { authError } = store.getState().loginReducer;

  if (authError !== undefined) {
    next.redirect('/login');
  } else {
    next();
  }
};

export const App: React.FC = () => {
  const { store } = useContext<ReactReduxContextValue<RootState, RootAction>>(ReactReduxContext as any);
  const dispatch = useDispatch();

  return (
    <div className="app">
      <Header />
      <GuardProvider loading={Loading}>
        <Switch>
          <GuardedRoute exact guards={[createRequireUnauthorized(store, dispatch)]} path="/login">
            <LoginPage />
          </GuardedRoute>
          <GuardedRoute exact guards={[createRequireAuthorized(store, dispatch)]} path="/">
            <HomePage />
          </GuardedRoute>
          <GuardedRoute exact guards={[createRequireAuthorized(store, dispatch)]} path="/lobbies/:lobbyId">
            <LobbyPage />
          </GuardedRoute>
          <GuardedRoute exact guards={[createRequireAuthorized(store, dispatch)]} path="/games/:gameId">
            <GamePage className="app__game-page" />
          </GuardedRoute>
        </Switch>
      </GuardProvider>
    </div>
  );
};
