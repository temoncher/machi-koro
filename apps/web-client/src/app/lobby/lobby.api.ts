import { LoginApi } from '../login/login.api';

export namespace LobbyApi {
  type SendCreateLobbyRequest = (lobbyRequestBody: CreateLobbyRequestBody) => Promise<CreateLobbyResponse>;

  export type Api = {
    sendCreateLobbyRequest: SendCreateLobbyRequest;
  };

  export type CreateLobbyRequestBody = {
    hostId: string;
  };

  export type CreateLobbyResponse = {
    lobbyId: string;
  };

  export const initializeSendCreateLobbyRequest = (
    { getHeaders, httpClient }: LoginApi.Dependencies,
  ): SendCreateLobbyRequest => async (lobbyRequestBody) => {
    const commonHeaders = getHeaders();

    const response = await httpClient.post('lobbies', lobbyRequestBody, {
      headers: commonHeaders,
    });

    return response.data as CreateLobbyResponse;
  };

  export const init = (deps: LoginApi.Dependencies): Api => ({
    sendCreateLobbyRequest: initializeSendCreateLobbyRequest(deps),
  });
}
