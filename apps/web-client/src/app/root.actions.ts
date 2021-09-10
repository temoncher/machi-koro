import { RouterAction } from 'connected-react-router';

import { LoadingAction } from './loading/loading.actions';
import { LobbyAction } from './lobby/lobby.actions';
import { LoginAction } from './login/login.actions';

export type RootAction = LoginAction | LoadingAction | LobbyAction | RouterAction;
