import { RouterState } from 'connected-react-router';

/**
 * As I remember these imports should stay as is
 * without importing from './game', './lobby' or something like that
 * It has something to do with cyclic dependencies
 */
import { GameState } from './game/game.state';
import { LoadingState } from './loading/loading.state';
import { LobbyState } from './lobby/lobby.state';
import { LoginState } from './login/login.state';
import { WebsocketState } from './websocket/websocket.state';

export type RootState = {
  loginReducer: LoginState;
  loadingReducer: LoadingState;
  lobbyReducer: LobbyState;
  gameReducer: GameState;
  websocketReducer: WebsocketState;
  router: RouterState;
};
