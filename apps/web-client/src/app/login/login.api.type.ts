import { LoginResponse, RegisterRequestBody } from '@machikoro/game-server-contracts';
import { AxiosInstance } from 'axios';

import { AppHeaders } from '../types';

export namespace LoginApiType {

  export type FetchLogin = (loginRequestBody: RegisterRequestBody) => Promise<LoginResponse>;
  export type FetchUserData = () => Promise<LoginResponse>;

  export type Api = {
    fetchRegisterGuest: FetchLogin;
    fetchUserData: FetchUserData;
  };

  export type FetchUserDataDependencies = {
    getHeaders: () => AppHeaders;
    httpClient: AxiosInstance;
  };

  export type FetchRegisterGuestDependencies = {
    getHeaders: () => AppHeaders;
    httpClient: AxiosInstance;
  };

  export type Dependencies = FetchRegisterGuestDependencies & FetchUserDataDependencies;

  export type AuthRequestBody = {
    username: string;
    type: 'guest';
  };
}
