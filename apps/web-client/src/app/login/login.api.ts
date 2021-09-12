import { LoginResponse } from '@machikoro/game-server-contracts';

import { LoginApiType } from './login.api.type';

export namespace LoginApi {
  export const initializeFetchRegisterGuest = (
    { getHeaders, httpClient }: LoginApiType.FetchRegisterGuestDependencies,
  ): LoginApiType.FetchLogin => async (loginRequestBody) => {
    const commonHeaders = getHeaders();

    const response = await httpClient.post('auth/register', loginRequestBody, {
      headers: commonHeaders,
    });

    return response.data as LoginResponse;
  };

  const initializeFetchUserData = (
    { getHeaders, httpClient }: LoginApiType.FetchUserDataDependencies,
  ): LoginApiType.FetchUserData => async () => {
    const commonHeaders = getHeaders();

    const response = await httpClient.get('auth/me', {
      headers: commonHeaders,
    });

    return response.data as LoginResponse;
  };

  export const init = (deps: LoginApiType.Dependencies): LoginApiType.Api => ({
    fetchRegisterGuest: initializeFetchRegisterGuest(deps),
    fetchUserData: initializeFetchUserData(deps),
  });
}
