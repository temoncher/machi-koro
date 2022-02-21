import { AuthMeResponse, RegisterGuestResponse } from '@machikoro/game-server-contracts';

import { LoginApiType } from './login.api.type';

export namespace LoginApi {
  export const initializeSendRegisterGuestRequest = (
    { httpClient }: LoginApiType.SendRegisterGuestRequestDependencies,
  ): LoginApiType.SendRegisterGuestRequest => async (loginRequestBody) => {
    const response = await httpClient.post('auth/register', loginRequestBody);

    return response.data as RegisterGuestResponse;
  };

  const initializeSendAuthMeRequest = (
    { httpClient }: LoginApiType.SendAuthMeRequestDependencies,
  ): LoginApiType.SendAuthMeRequest => async () => {
    const response = await httpClient.get('auth/me');

    return response.data as AuthMeResponse;
  };

  export const init = (deps: LoginApiType.Dependencies): LoginApiType.Api => ({
    sendRegisterGuestRequest: initializeSendRegisterGuestRequest(deps),
    sendAuthMeRequest: initializeSendAuthMeRequest(deps),
  });
}
