import {
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
  '[EVENT] APP/GAME/ABANDON_GAME_BUTTON_CLICKED': empty(),
  '[DOCUMENT] APP/GAME/SET_GAME': payload<Game | undefined>(),
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
  rollDiceCommand: GameAction.rollDiceCommand,
  passCommand: GameAction.passCommand,
  startGameCommand: GameAction.startGameCommand,
  buildEstablishmentCommand: GameAction.buildEstablishmentCommand,
  buildLandmarkCommand: GameAction.buildLandmarkCommand,
};
