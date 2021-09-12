import { CreateLobbyRequestBody, CreateLobbyResponse } from '@machikoro/game-server-contracts';
import { AxiosInstance } from 'axios';

import { AppHeaders } from '../types';

export namespace LobbyApiType {
  export type SendCreateLobbyRequest = (lobbyRequestBody: CreateLobbyRequestBody) => Promise<CreateLobbyResponse>;

  export type Api = {
    sendCreateLobbyRequest: SendCreateLobbyRequest;
  };

  export type SendCreateLobbyRequestDependencies = {
    getHeaders: () => AppHeaders;
    httpClient: AxiosInstance;
  };

  export type Dependencies = SendCreateLobbyRequestDependencies;
}
