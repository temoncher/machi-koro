import { GameApiType } from './game/game.api.type';
import { LobbyApiType } from './lobby/lobby.api.type';
import { LoginApiType } from './login/login.api.type';

export namespace RootApiType {

  export type Dependencies = LoginApiType.Dependencies & LobbyApiType.Dependencies & GameApiType.Dependencies;

  export type RootApi = {
    loginApi: LoginApiType.Api;
    lobbyApi: LobbyApiType.Api;
    gameApi: GameApiType.Api;
  };
}
