import { RouterState } from 'connected-react-router';

/**
 * As I remember these imports should stay as is
 * without importing from './game', './lobby' or something like that
 * It has something to do with cyclic dependencies
 */
import { GameState } from './game/game.state';
import { createLobbyReducer } from './home/home.endpoints';
import { joinLobbyReducer, leaveLobbyReducer, createGameReducer } from './lobby/lobby.endpoints';
import { LobbyState } from './lobby/lobby.state';
import { LoginState } from './login/login.state';
import { registerGuestReducer } from './login/registerGuest.endpoint';
import { GetStateType } from './utils/createEndpoint';

export type RootState = {
  loginReducer: LoginState;
  lobbyReducer: LobbyState;
  gameReducer: GameState;
  router: RouterState;
  requests: {
    registerGuestReducer: GetStateType<typeof registerGuestReducer>;
    createLobbyReducer: GetStateType<typeof createLobbyReducer>;
    joinLobbyReducer: GetStateType<typeof joinLobbyReducer>;
    leaveLobbyReducer: GetStateType<typeof leaveLobbyReducer>;
    createGameReducer: GetStateType<typeof createGameReducer>;
  };
};
