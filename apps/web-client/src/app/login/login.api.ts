import { AuthMeResponse, RegisterGuestResponse } from '@machikoro/game-server-contracts';

import { LoginApiType } from './login.api.type';

export namespace LoginApi {
  export const initializeSendRegisterGuestRequest = (
    { getHeaders, httpClient }: LoginApiType.SendRegisterGuestRequestDependencies,
  ): LoginApiType.SendRegisterGuestRequest => async (loginRequestBody) => {
    const commonHeaders = getHeaders();

    const response = await httpClient.post('auth/register', loginRequestBody, {
      headers: commonHeaders,
    });

    return response.data as RegisterGuestResponse;
  };

  const initializeSendAuthMeRequest = (
    { getHeaders, httpClient }: LoginApiType.SendAuthMeRequestDependencies,
  ): LoginApiType.SendAuthMeRequest => async () => {
    const commonHeaders = getHeaders();

    const response = await httpClient.get('auth/me', {
      headers: commonHeaders,
    });

    return response.data as AuthMeResponse;
  };

  export const init = (deps: LoginApiType.Dependencies): LoginApiType.Api => ({
    sendRegisterGuestRequest: initializeSendRegisterGuestRequest(deps),
    sendAuthMeRequest: initializeSendAuthMeRequest(deps),
  });
}
