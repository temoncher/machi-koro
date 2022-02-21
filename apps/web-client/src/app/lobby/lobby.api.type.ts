import { CreateLobbyRequestBody, CreateLobbyResponse } from '@machikoro/game-server-contracts';
import { AxiosInstance } from 'axios';

export namespace LobbyApiType {
  export type SendCreateLobbyRequest = (lobbyRequestBody: CreateLobbyRequestBody) => Promise<CreateLobbyResponse>;

  export type Api = {
    sendCreateLobbyRequest: SendCreateLobbyRequest;
  };

  export type SendCreateLobbyRequestDependencies = {
    httpClient: AxiosInstance;
  };

  export type Dependencies = SendCreateLobbyRequestDependencies;
}
