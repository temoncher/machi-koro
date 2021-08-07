import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { HomePage } from './home/HomePage';
import { LoginPage } from './login/LoginPage';

export const App: React.FC = () => (
  <div className="App">
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
