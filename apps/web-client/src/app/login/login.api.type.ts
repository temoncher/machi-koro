import { AuthMeResponse, RegisterGuestRequestBody, RegisterGuestResponse } from '@machikoro/game-server-contracts';
import { AxiosInstance } from 'axios';

import { AppHeaders } from '../types';

export namespace LoginApiType {

  export type SendRegisterGuestRequest = (loginRequestBody: RegisterGuestRequestBody) => Promise<RegisterGuestResponse>;
  export type SendAuthMeRequest = () => Promise<AuthMeResponse>;

  export type Api = {
    sendRegisterGuestRequest: SendRegisterGuestRequest;
    sendAuthMeRequest: SendAuthMeRequest;
  };

  export type SendAuthMeRequestDependencies = {
    getHeaders: () => AppHeaders;
    httpClient: AxiosInstance;
  };

  export type SendRegisterGuestRequestDependencies = {
    getHeaders: () => AppHeaders;
    httpClient: AxiosInstance;
  };

  export type Dependencies = SendRegisterGuestRequestDependencies & SendAuthMeRequestDependencies;

}
