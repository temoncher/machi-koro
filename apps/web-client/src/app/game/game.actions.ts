import {
  CreateGameRequestBody,
  CreateGameResponse,
  EstablishmentId,
  GameId,
  LandmarkId,
  Game,
} from '@machikoro/game-server-contracts';
import { action, payload } from 'ts-action';

enum GameActionType {
  ENTERED_GAME_PAGE_EVENT = '[EVENT] APP/GAME/ENTERED_GAME_PAGE',
  SET_GAME_DOCUMENT = '[DOCUMENT] APP/GAME/SET_GAME',
  CREATE_GAME_COMMAND = '[COMMAND] APP/GAME/CREATE_GAME',
  CREATE_GAME_RESOLVED_EVENT = '[EVENT] APP/GAME/CREATE_GAME/RESOLVED',
  CREATE_GAME_REJECTED_EVENT = '[EVENT] APP/GAME/CREATE_GAME/REJECTED',
  JOIN_GAME_COMMAND = '[COMMAND] APP/GAME/JOIN_GAME',
  ROLL_DICE_COMMAND = '[COMMAND] APP/GAME/ROLL_DICE',
  PASS_COMMAND = '[COMMAND] APP/GAME/PASS',
  START_GAME_COMMAND = '[COMMAND] APP/GAME/START_GAME',
  BUILD_ESTABLISHMENT_COMMAND = '[COMMAND] APP/GAME/BUILD_ESTABLISHMENT',
  BUILD_LANDMARK_COMMAND = '[COMMAND] APP/GAME/BUILD_LANDMARK',
}

export namespace GameAction {
  export const enteredGamePageEvent = action(
    GameActionType.ENTERED_GAME_PAGE_EVENT,
    payload<GameId>(),
  );

  export const setGameDocument = action(
    GameActionType.SET_GAME_DOCUMENT,
    payload<Game | undefined>(),
  );

  export const createGameCommand = action(
    GameActionType.CREATE_GAME_COMMAND,
    payload<CreateGameRequestBody>(),
  );

  export const createGameResolvedEvent = action(
    GameActionType.CREATE_GAME_RESOLVED_EVENT,
    payload<CreateGameResponse>(),
  );

  export const createGameRejectedEvent = action(
    GameActionType.CREATE_GAME_REJECTED_EVENT,
    payload<string>(),
  );

  export const joinGameCommand = action(
    GameActionType.JOIN_GAME_COMMAND,
    payload<GameId>(),
  );

  export const rollDiceCommand = action(GameActionType.ROLL_DICE_COMMAND);
  export const passCommand = action(GameActionType.ROLL_DICE_COMMAND);
  export const startGameCommand = action(GameActionType.START_GAME_COMMAND);
  export const buildEstablishmentCommand = action(
    GameActionType.BUILD_ESTABLISHMENT_COMMAND,
    payload<EstablishmentId>(),
  );
  export const buildLandmarkCommand = action(
    GameActionType.BUILD_ESTABLISHMENT_COMMAND,
    payload<LandmarkId>(),
  );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GameAction =
  | ReturnType<typeof GameAction.createGameCommand>
  | ReturnType<typeof GameAction.createGameResolvedEvent>
  | ReturnType<typeof GameAction.createGameRejectedEvent>
  | ReturnType<typeof GameAction.joinGameCommand>
  | ReturnType<typeof GameAction.passCommand>
  | ReturnType<typeof GameAction.startGameCommand>
  | ReturnType<typeof GameAction.buildEstablishmentCommand>
  | ReturnType<typeof GameAction.buildLandmarkCommand>;

export const gameActions = {
  createGameCommand: GameAction.createGameCommand,
  rollDiceCommand: GameAction.rollDiceCommand,
  passCommand: GameAction.passCommand,
  startGameCommand: GameAction.startGameCommand,
  buildEstablishmentCommand: GameAction.buildEstablishmentCommand,
  buildLandmarkCommand: GameAction.buildLandmarkCommand,
};
