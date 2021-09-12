import { GameApi } from './game';
import { LobbyApi } from './lobby';
import { LoginApi } from './login';
import { RootApiType } from './root.api.type';

export namespace RootApi {

  export const init = (deps: RootApiType.Dependencies): RootApiType.RootApi => ({
    loginApi: LoginApi.init(deps),
    lobbyApi: LobbyApi.init(deps),
    gameApi: GameApi.init(deps),
  });
}
