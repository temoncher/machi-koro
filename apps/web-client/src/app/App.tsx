import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { match } from 'ts-pattern';

import { GamePage } from './game';
import { HomePage } from './home';
import { useTypedSelector } from './hooks';
import { Header } from './layout';
import { Loading } from './loading';
import { LobbyPage } from './lobby';
import { LoginPage, useLoginActions } from './login';
import { LoginStatus } from './types';

import './App.css';

export const App: React.FC = () => {
  const { authorizeCommand } = useLoginActions();
  const loginStatus = useTypedSelector((state) => state.loginReducer.status);

  useEffect(() => {
    authorizeCommand();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRoutes = () => match(loginStatus)
    .with(LoginStatus.PENDING, () => <Loading />)
    .with(LoginStatus.NOT_AUTHORIZED, () => (
      <Route exact path="/login">
        <LoginPage />
      </Route>
    ))
    .with(LoginStatus.AUTHORIZED, () => (
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/lobbies/:lobbyId">
          <LobbyPage />
        </Route>
        <Route exact path="/games/:gameId">
          <GamePage className="app__game-page" />
        </Route>
      </Switch>
    ))
    .exhaustive();

  return (
    <div className="app">
      <Header />
      {renderRoutes()}
    </div>
  );
};
