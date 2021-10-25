import { RouterState } from 'connected-react-router';

import { GameState } from './game/game.state';
import { LoadingState } from './loading/loading.state';
import { LobbyState } from './lobby/lobby.state';
import { LoginState } from './login/login.state';

export type RootState = {
  loginReducer: LoginState;
  loadingReducer: LoadingState;
  lobbyReducer: LobbyState;
  gameReducer: GameState;
  router: RouterState;
};
