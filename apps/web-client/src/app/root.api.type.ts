import { LobbyApiType } from './lobby/lobby.api.type';
import { LoginApiType } from './login/login.api.type';

export namespace RootApiType {

  export type Dependencies = LoginApiType.Dependencies & LobbyApiType.Dependencies;

  export type RootApi = {
    loginApi: LoginApiType.Api;
    lobbyApi: LobbyApiType.Api;
  };
}
