import { AxiosInstance } from 'axios';

export namespace LoginApi {
  type RegisterRequestBody = {
    username: string;
    type: 'guest';
  };

  type LoginResponse = {
    username: string;
    id: string;
    token?: string;
  };

  type FetchLogin = (loginRequestBody: RegisterRequestBody) => Promise<LoginResponse>;
  type FetchUserData = () => Promise<LoginResponse>;

  export type Api = {
    fetchRegisterGuest: FetchLogin;
    fetchUserData: FetchUserData;
  };

  export type HeadersType = {
    Authorization: string;
    'Content-Type': string;
  };

  export type Dependencies = {
    getHeaders: () => HeadersType;
    httpClient: AxiosInstance;
  };

  export type AuthRequestBody = {
    username: string;
    type: 'guest';
  };

  export const initializeFetchRegisterGuest = ({ getHeaders, httpClient }: Dependencies): FetchLogin => async (loginRequestBody) => {
    const commonHeaders = getHeaders();

    const response = await httpClient.post('auth/register', loginRequestBody, {
      headers: commonHeaders,
    });

    return response.data as LoginResponse;
  };

  const initializeFetchUserData = ({ getHeaders, httpClient }: Dependencies): FetchUserData => async () => {
    const commonHeaders = getHeaders();

    const response = await httpClient.get('auth/me', {
      headers: commonHeaders,
    });

    return response.data as LoginResponse;
  };

  export const init = (deps: Dependencies): Api => ({
    fetchRegisterGuest: initializeFetchRegisterGuest(deps),
    fetchUserData: initializeFetchUserData(deps),
  });
}
