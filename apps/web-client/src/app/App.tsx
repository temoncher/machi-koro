import React, { useContext } from 'react';
import { ReactReduxContext, ReactReduxContextValue, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';

import './App.css';
import { GamePage } from './game/GamePage';
import { HomePage } from './home/HomePage';
import { Header } from './layout/Header';
import { Loading } from './loading/Loading';
import { LobbyPage } from './lobby/LobbyPage';
import { LoginPage } from './login/LoginPage';
import { RootAction } from './root.actions';
import { RootState } from './root.state';
import { createRequireLogin } from './utils/createRequireLogin';

const mockCurrentUserId = '1';

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
