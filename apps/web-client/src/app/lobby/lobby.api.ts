import { CreateLobbyResponse } from '@machikoro/game-server-contracts';

import { LobbyApiType } from './lobby.api.type';

export namespace LobbyApi {

  export const initializeSendCreateLobbyRequest = (
    { getHeaders, httpClient }: LobbyApiType.SendCreateLobbyRequestDependencies,
  ): LobbyApiType.SendCreateLobbyRequest => async (lobbyRequestBody) => {
    const commonHeaders = getHeaders();

    const response = await httpClient.post('lobbies', lobbyRequestBody, {
      headers: commonHeaders,
    });

    return response.data as CreateLobbyResponse;
  };

  export const init = (deps: LobbyApiType.Dependencies): LobbyApiType.Api => ({
    sendCreateLobbyRequest: initializeSendCreateLobbyRequest(deps),
  });
}
