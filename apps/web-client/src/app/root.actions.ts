import { RouterAction } from 'connected-react-router';

import { GameAction } from './game';
import { LoadingAction } from './loading';
import { LobbyAction } from './lobby';
import { LoginAction } from './login';

export type RootAction =
  | GameAction
  | LoginAction
  | LoadingAction
  | LobbyAction
  | RouterAction;
