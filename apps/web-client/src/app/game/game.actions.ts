import {
  CreateGameRequestBody,
  CreateGameResponse,
  EstablishmentId,
  GameId,
  LandmarkId,
  Game,
} from '@machikoro/game-server-contracts';
import { empty, payload } from 'ts-action';

import { createActionsNamespace, GetNamespaceActionType } from '../utils/createActionsNamespace';

const gameActionTypeToPayloadMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  '[EVENT] APP/GAME/ENTERED_GAME_PAGE': payload<GameId>(),
  '[DOCUMENT] APP/GAME/SET_GAME': payload<Game | undefined>(),
  '[COMMAND] APP/GAME/CREATE_GAME': payload<CreateGameRequestBody>(),
  '[EVENT] APP/GAME/CREATE_GAME_RESOLVED': payload<CreateGameResponse>(),
  '[EVENT] APP/GAME/CREATE_GAME_REJECTED': payload<string>(),
  '[COMMAND] APP/GAME/JOIN_GAME': payload<GameId>(),
  '[COMMAND] APP/GAME/ROLL_DICE': empty(),
  '[COMMAND] APP/GAME/PASS': empty(),
  '[COMMAND] APP/GAME/START_GAME': empty(),
  '[COMMAND] APP/GAME/BUILD_ESTABLISHMENT': payload<EstablishmentId>(),
  '[COMMAND] APP/GAME/BUILD_LANDMARK': payload<LandmarkId>(),
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const GameAction = createActionsNamespace(gameActionTypeToPayloadMap);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GameAction = GetNamespaceActionType<typeof GameAction>;

export const gameActions = {
  createGameCommand: GameAction.createGameCommand,
  rollDiceCommand: GameAction.rollDiceCommand,
  passCommand: GameAction.passCommand,
  startGameCommand: GameAction.startGameCommand,
  buildEstablishmentCommand: GameAction.buildEstablishmentCommand,
  buildLandmarkCommand: GameAction.buildLandmarkCommand,
};
