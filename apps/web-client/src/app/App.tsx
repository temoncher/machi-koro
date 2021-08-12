import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import './App.css';
import { HomePage } from './home/HomePage';
import { Header } from './layout/Header';
import { LoginPage } from './login/LoginPage';

export const App: React.FC = () => (
  <div className="app">
    <Header />
    <Switch>
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
    </Switch>
  </div>
);
