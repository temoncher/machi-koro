import { RouterAction } from 'connected-react-router';

import { LoadingAction } from './loading';
import { LobbyAction } from './lobby';
import { LoginAction } from './login';

export type RootAction = LoginAction | LoadingAction | LobbyAction | RouterAction;
