import { CreateGameResponse } from '@machikoro/game-server-contracts';

import { GameApiType } from './game.api.type';

export namespace GameApi {
  export const initializeSendCreateGameRequest = (
    { httpClient }: GameApiType.SendCreateGameRequestDependencies,
  ): GameApiType.SendCreateGameRequest => async (gameRequestBody) => {
    const response = await httpClient.post('games', gameRequestBody);

    return response.data as CreateGameResponse;
  };

  export const init = (deps: GameApiType.Dependencies): GameApiType.Api => ({
    sendCreateGameRequest: initializeSendCreateGameRequest(deps),
  });
}
