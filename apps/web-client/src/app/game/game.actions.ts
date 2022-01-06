import { CreateGameRequestBody, CreateGameResponse } from '@machikoro/game-server-contracts';
import { action, payload } from 'ts-action';

enum GameActionType {
  CREATE_GAME_COMMAND = '[COMMAND] APP/GAME/CREATE_GAME',
  CREATE_GAME_RESOLVED = '[EVENT] APP/GAME/CREATE_GAME/RESOLVED',
  CREATE_GAME_REJECTED = '[EVENT] APP/GAME/CREATE_GAME/REJECTED',
}

export const createGameCommand = action(
  GameActionType.CREATE_GAME_COMMAND,
  payload<CreateGameRequestBody>(),
);

export const createGameResolvedEvent = action(
  GameActionType.CREATE_GAME_RESOLVED,
  payload<CreateGameResponse>(),
);

export const createGameRejectedEvent = action(
  GameActionType.CREATE_GAME_REJECTED,
  payload<string>(),
);

export type GameAction =
  | ReturnType<typeof createGameCommand>
  | ReturnType<typeof createGameResolvedEvent>
  | ReturnType<typeof createGameRejectedEvent>;

export const gameActions = {
  createGameCommand,
};
