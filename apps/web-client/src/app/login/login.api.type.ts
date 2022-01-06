import { AuthMeResponse, RegisterGuestRequestBody, RegisterGuestResponse } from '@machikoro/game-server-contracts';
import { AxiosInstance } from 'axios';

export namespace LoginApiType {
  export type SendRegisterGuestRequest = (loginRequestBody: RegisterGuestRequestBody) => Promise<RegisterGuestResponse>;
  export type SendAuthMeRequest = () => Promise<AuthMeResponse>;

  export type Api = {
    sendRegisterGuestRequest: SendRegisterGuestRequest;
    sendAuthMeRequest: SendAuthMeRequest;
  };

  export type SendAuthMeRequestDependencies = {
    httpClient: AxiosInstance;
  };

  export type SendRegisterGuestRequestDependencies = {
    httpClient: AxiosInstance;
  };

  export type Dependencies = SendRegisterGuestRequestDependencies & SendAuthMeRequestDependencies;

}
