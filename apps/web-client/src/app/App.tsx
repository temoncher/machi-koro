import React, { useContext } from 'react';
import { ReactReduxContext, ReactReduxContextValue, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import {
  GuardProvider,
  GuardedRoute,
  Next,
} from 'react-router-guards';
import './App.css';
import { GuardFunctionRouteProps, GuardToRoute } from 'react-router-guards/dist/types';
import { Dispatch, Store } from 'redux';

import { GamePage } from './game';
import { HomePage } from './home';
import { Header } from './layout';
import { Loading } from './loading';
import { LobbyPage } from './lobby';
import { getUserData, LoginPage } from './login';
import { RootAction } from './root.actions';
import { RootState } from './root.state';

const mockCurrentUserId = '1';

export const createRequireLogin = (store: Store<RootState, RootAction>, dispatch: Dispatch<any>) => async (
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
      <Switch>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/game" exact>
          <GamePage className="app__game-page" />
        </Route>
        <GuardProvider guards={[createRequireLogin(store, dispatch)]} loading={Loading}>
          <GuardedRoute path="/" exact>
            <HomePage />
          </GuardedRoute>
          <GuardedRoute path="/home" exact>
            <HomePage />
          </GuardedRoute>
          <GuardedRoute path="/lobbies/:lobbyId" exact>
            <LobbyPage currentUserId={mockCurrentUserId} />
          </GuardedRoute>
        </GuardProvider>
      </Switch>
    </div>
  );
};
