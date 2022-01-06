import { CreateLobbyResponse } from '@machikoro/game-server-contracts';

import { LobbyApiType } from './lobby.api.type';

export namespace LobbyApi {
  export const initializeSendCreateLobbyRequest = (
    { httpClient }: LobbyApiType.SendCreateLobbyRequestDependencies,
  ): LobbyApiType.SendCreateLobbyRequest => async (lobbyRequestBody) => {
    const response = await httpClient.post('lobbies', lobbyRequestBody);

    return response.data as CreateLobbyResponse;
  };

  export const init = (deps: LobbyApiType.Dependencies): LobbyApiType.Api => ({
    sendCreateLobbyRequest: initializeSendCreateLobbyRequest(deps),
  });
}
