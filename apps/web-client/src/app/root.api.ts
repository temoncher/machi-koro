import { LobbyApi } from './lobby/lobby.api';
import { LoginApi } from './login/login.api';

export namespace RootApi {

  type Dependencies = LoginApi.Dependencies;

  export type RootApi = {
    loginApi: LoginApi.Api;
    lobbyApi: LobbyApi.Api;
  };

  export const init = (deps: Dependencies): RootApi => ({
    loginApi: LoginApi.init(deps),
    lobbyApi: LobbyApi.init(deps),
  });
}
