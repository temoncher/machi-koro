import {
  CreateGameRequestBody,
  CreateGameResponse,
} from '@machikoro/game-server-contracts';
import { AxiosInstance } from 'axios';

export namespace GameApiType {
  export type SendCreateGameRequest = (GameRequestBody: CreateGameRequestBody) => Promise<CreateGameResponse>;

  export type Api = {
    sendCreateGameRequest: SendCreateGameRequest;
  };

  export type SendCreateGameRequestDependencies = {
    httpClient: AxiosInstance;
  };

  export type Dependencies = SendCreateGameRequestDependencies;
}
