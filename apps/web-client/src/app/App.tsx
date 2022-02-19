import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { match } from 'ts-pattern';

import { GamePage } from './game';
import { HomePage } from './home';
import { useTypedSelector } from './hooks';
import { Header } from './layout';
import { LobbyPage } from './lobby';
import { LoginPage, useLoginActions } from './login';
import { theme } from './theme';
import { LoginStatus } from './types/LoginStatus';

import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
  const { authorizeCommand } = useLoginActions();
  const loginStatus = useTypedSelector((state) => state.loginReducer.status);

  useEffect(() => {
    authorizeCommand();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRoutes = () => match(loginStatus)
    .with(LoginStatus.PENDING, () => <CircularProgress />)
    .with(LoginStatus.NOT_AUTHORIZED, () => (
      <Route exact path="/login">
        <LoginPage sx={{ flexGrow: 1 }} />
      </Route>
    ))
    .with(LoginStatus.AUTHORIZED, () => (
      <Switch>
        <Route exact path="/">
          <HomePage sx={{ flexGrow: 1 }} />
        </Route>
        <Route exact path="/lobbies/:lobbyId">
          <LobbyPage sx={{ flexGrow: 1 }} />
        </Route>
        <Route exact path="/games/:gameId">
          <GamePage sx={{ flexGrow: 1 }} />
        </Route>
      </Switch>
    ))
    .exhaustive();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header sx={{ flexGrow: 0 }} />
        {renderRoutes()}
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
      </Box>
    </ThemeProvider>
  );
};
