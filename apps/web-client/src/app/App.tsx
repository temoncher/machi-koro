import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import './App.css';
import { GamePage } from './game/GamePage';
import { HomePage } from './home/HomePage';
import { Header } from './layout/Header';
import { LoginPage } from './login/LoginPage';

export const App: React.FC = () => (
  <div className="app">
    <Header className="app__header" />
    <Switch>
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/game">
        <GamePage className="app__game-page" />
      </Route>
    </Switch>
  </div>
);
