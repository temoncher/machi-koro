import { CreateGameRequestBody, CreateGameResponse } from '@machikoro/game-server-contracts';
import { AxiosInstance } from 'axios';

import { AppHeaders } from '../types';

export namespace GameApiType {
  export type SendCreateGameRequest = (GameRequestBody: CreateGameRequestBody) => Promise<CreateGameResponse>;

  export type Api = {
    sendCreateGameRequest: SendCreateGameRequest;
  };

  export type SendCreateGameRequestDependencies = {
    getHeaders: () => AppHeaders;
    httpClient: AxiosInstance;
  };

  export type Dependencies = SendCreateGameRequestDependencies;
}
