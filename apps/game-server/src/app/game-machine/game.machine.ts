import {
  allGameEstablishments,
  allGameLandmarks,
  Establishment,
  EstablishmentId,
  GameContext,
  Landmark,
  LandmarkId,
  UserId,
} from '@machikoro/game-server-contracts';
import { createMachine, assign } from 'xstate';

import { RecordUtils } from '../utils';

import { establishmentsEffectsMap } from './establishments';

type RollDiceMessage = {
  type: 'ROLL_DICE';
  userId: UserId;
};
type StartGame = {
  type: 'START_GAME';
  usersIds: UserId[];
};
type Pass = {
  type: 'PASS';
  userId: UserId;
};
type BuildEstablishment = {
  type: 'BUILD_ESTABLISHMENT';
  userId: UserId;
  establishmentToBuild: EstablishmentId;
};
type BuildLandmark = {
  type: 'BUILD_LANDMARK';
  userId: UserId;
  landmarkToBuild: LandmarkId;
};

type GameMachineMessage =
  | RollDiceMessage
  | StartGame
  | Pass
  | BuildEstablishment
  | BuildLandmark;

const canRollDice = (
  context: GameContext,
  message: GameMachineMessage,
) => message.type === 'ROLL_DICE' && context.activePlayerId === message.userId;

const rollDice = assign<GameContext, GameMachineMessage>({
  rollDiceResult: (context, message) => {
    if (message.type !== 'ROLL_DICE') {
      return context.rollDiceResult;
    }

    return Math.floor((Math.random() * 6) + 1);
  },
});

const sortEstablishmentsInOrderOfActivation = (firstEstablishment: Establishment, secondEstablishment: Establishment) => {
  if (firstEstablishment.domain === 'restaurant') {
    return -1;
  }

  if (firstEstablishment.domain === 'majorEstablishment' && secondEstablishment.domain !== 'restaurant') {
    return -1;
  }

  if (secondEstablishment.domain === 'shopsFactoriesAndMarket') {
    return 1;
  }

  return 0;
};

const applyEstablishmentEffects = assign<GameContext, GameMachineMessage>((context, message) => {
  if (message.type !== 'ROLL_DICE') {
    return context;
  }

  const establishmentsToApplyEffectsOf = Object.values(context.gameEstablishments).filter(
    (establishment) => establishment.activation.some((count) => count === context.rollDiceResult),
  );

  return [...establishmentsToApplyEffectsOf]
    .sort(sortEstablishmentsInOrderOfActivation)
    .reduce((contextSoFar, establishment) => {
      const effect = establishmentsEffectsMap[establishment.establishmentId];

      if (effect) {
        return effect(contextSoFar);
      }

      return contextSoFar;
    }, context);
});

const buildLandmark = assign<GameContext, GameMachineMessage>((context, message) => {
  if (message.type !== 'BUILD_LANDMARK') {
    return context;
  }

  const activePlayerLandmarks = context.landmarks[context.activePlayerId];
  const currentGameLandmark = allGameLandmarks[message.landmarkToBuild];

  if (!activePlayerLandmarks || !currentGameLandmark) {
    return context;
  }

  const playerWithUpdatedLandmarks = RecordUtils.modifyAt(message.landmarkToBuild, () => true, activePlayerLandmarks);
  const playersWithUpdatedLandmarks = RecordUtils.modifyAt(message.userId, () => playerWithUpdatedLandmarks, context.landmarks);

  const updatedCoins = RecordUtils.modifyAt(message.userId, (coins) => coins - currentGameLandmark.cost, context.coins);

  return {
    ...context,
    landmarks: playersWithUpdatedLandmarks,
    coins: updatedCoins,
  };
});

const buildEstablishment = assign<GameContext, GameMachineMessage>((context, message) => {
  if (message.type !== 'BUILD_ESTABLISHMENT') {
    return context;
  }

  const { establishmentToBuild } = message;
  const currentPlayerEstablishments = context.establishments[context.activePlayerId];
  const currentGameEstablishment = allGameEstablishments[establishmentToBuild];

  if (!currentPlayerEstablishments || !currentGameEstablishment) {
    return context;
  }

  const playersWithUpdatedEstablishments = RecordUtils.mapWithIndex((playerId, establishments) => {
    if (playerId !== message.userId) {
      return establishments;
    }

    const currentEstablishmentQuantity = currentPlayerEstablishments[message.establishmentToBuild];

    if (currentEstablishmentQuantity === undefined) {
      return { ...currentPlayerEstablishments, [establishmentToBuild]: 1 };
    }

    return { ...currentPlayerEstablishments, [establishmentToBuild]: currentEstablishmentQuantity + 1 };
  }, context.establishments);

  const updatedCoins = RecordUtils.modifyAt(message.userId, (coins) => coins - currentGameEstablishment.cost, context.coins);

  const updatedEstablishmentsQuantity = RecordUtils.modifyAt(
    message.establishmentToBuild,
    (quantity) => quantity - 1,
    context.shop,
  );

  return {
    ...context,
    establishments: playersWithUpdatedEstablishments,
    coins: updatedCoins,
    shop: updatedEstablishmentsQuantity,
  };
});

const chooseNextPlayer = assign<GameContext, GameMachineMessage>({
  activePlayerId: (context) => {
    const activePlayerIndex = context.players.findIndex((player) => player.userId === context.activePlayerId);
    const nextPlayerIndex = (activePlayerIndex + 1) % context.players.length;
    const nextPlayer = context.players[nextPlayerIndex];

    if (!nextPlayer) {
      return context.activePlayerId;
    }

    return nextPlayer.userId;
  },
});

const hasWinner = (context: GameContext) => {
  const activePlayerLandmarks = context.landmarks[context.activePlayerId];

  if (!activePlayerLandmarks) {
    return false;
  }

  const allLandmarksAreBuilt = Object.values(activePlayerLandmarks).every((isBuilt) => isBuilt === true);

  return allLandmarksAreBuilt;
};

const hasNoWinner = (context: GameContext) => {
  const activePlayerLandmarks = context.landmarks[context.activePlayerId];

  if (!activePlayerLandmarks) {
    return true;
  }

  const hasNotYetBuiltEstablishments = Object.values(activePlayerLandmarks).some((isBuilt) => isBuilt === false);

  return hasNotYetBuiltEstablishments;
};

const ensurePlayerCanBuildLandmark = (
  playerLandmarks: Record<string, boolean>,
  gameLandmark: Landmark,
  playerCoins: number,
): boolean => {
  const currentPlayerAlreadyOwnsThisLandmark = playerLandmarks[gameLandmark.landmarkId];

  return !currentPlayerAlreadyOwnsThisLandmark && gameLandmark.cost <= playerCoins;
};

const canBuildLandmark = (context: GameContext, message: GameMachineMessage) => {
  if (message.type !== 'BUILD_LANDMARK' || context.activePlayerId !== message.userId) {
    return false;
  }

  const activePlayerCoins = context.coins[context.activePlayerId];
  const activePlayerLandmarks = context.landmarks[context.activePlayerId];
  const currentGameLandmark = allGameLandmarks[message.landmarkToBuild];

  if (!activePlayerLandmarks || !activePlayerCoins || !currentGameLandmark) {
    return false;
  }

  return ensurePlayerCanBuildLandmark(activePlayerLandmarks, currentGameLandmark, activePlayerCoins);
};

const canNotBuildLandmark = (context: GameContext, message: GameMachineMessage) => {
  if (message.type !== 'BUILD_LANDMARK') {
    return true;
  }

  const activePlayerCoins = context.coins[context.activePlayerId];
  const activePlayerLandmarks = context.landmarks[context.activePlayerId];
  const currentGameLandmark = allGameLandmarks[message.landmarkToBuild];

  if (context.activePlayerId !== message.userId || !currentGameLandmark || !activePlayerLandmarks || !activePlayerCoins) {
    return true;
  }

  return !ensurePlayerCanBuildLandmark(activePlayerLandmarks, currentGameLandmark, activePlayerCoins);
};

const ensurePlayerCanBuildEstablishment = (
  playerEstablishments: Record<EstablishmentId, number>,
  establishmentToBuild: Establishment,
  playerCoins: number,
  establishmentQuantity: number,
): boolean => {
  const alreadyHasThisEstablishment = !!playerEstablishments[establishmentToBuild.establishmentId];

  if (establishmentToBuild.domain === 'majorEstablishment' && alreadyHasThisEstablishment) {
    return false;
  }

  return establishmentQuantity > 0 && establishmentToBuild.cost <= playerCoins;
};

// eslint-disable-next-line complexity
const canBuildEstablishment = (context: GameContext, message: GameMachineMessage) => {
  if (message.type !== 'BUILD_ESTABLISHMENT' || context.activePlayerId !== message.userId) {
    return false;
  }

  const activePlayerEstablishments = context.establishments[context.activePlayerId];
  const activePlayerCoins = context.coins[context.activePlayerId];
  const currentGameEstablishment = allGameEstablishments[message.establishmentToBuild];
  const establishmentQuantity = context.shop[message.establishmentToBuild];

  if (!activePlayerEstablishments || !activePlayerCoins || !currentGameEstablishment || !establishmentQuantity) {
    return false;
  }

  return ensurePlayerCanBuildEstablishment(activePlayerEstablishments, currentGameEstablishment, activePlayerCoins, establishmentQuantity);
};

// eslint-disable-next-line complexity
const canNotBuildEstablishment = (context: GameContext, message: GameMachineMessage) => {
  if (message.type !== 'BUILD_ESTABLISHMENT') {
    return true;
  }

  const activePlayerEstablishments = context.establishments[context.activePlayerId];
  const activePlayerCoins = context.coins[context.activePlayerId];
  const currentGameEstablishment = allGameEstablishments[message.establishmentToBuild];
  const establishmentQuantity = context.shop[message.establishmentToBuild];

  if (context.activePlayerId !== message.userId
    || !currentGameEstablishment
    || !activePlayerEstablishments
    || !activePlayerCoins
    || !establishmentQuantity) {
    return true;
  }

  return !ensurePlayerCanBuildEstablishment(activePlayerEstablishments, currentGameEstablishment, activePlayerCoins, establishmentQuantity);
};

const endGame = assign<GameContext, GameMachineMessage>({ winnerId: (context) => context.activePlayerId });

const initializePlayers = assign<GameContext, GameMachineMessage>((context, message) => {
  if (message.type !== 'START_GAME') {
    return context;
  }

  const gameLandmarks = Object.values(allGameLandmarks);
  const playerlandmarks = Object.fromEntries(gameLandmarks.map((landmark) => [landmark.landmarkId, false]));
  const establishmentsQuantity = Object.fromEntries(Object.entries(allGameEstablishments).map(([establishmentId, establishment]) => {
    if (establishment.domain === 'majorEstablishment') {
      return [establishmentId, 5];
    }

    return [establishmentId, 6];
  }));

  return {
    ...context,
    players: message.usersIds.map((userId) => ({ userId })),
    landmarks: Object.fromEntries(message.usersIds.map((userId) => ([userId, { ...playerlandmarks }]))),
    gameEstablishments: allGameEstablishments,
    shop: establishmentsQuantity,
    gameLandmarks: allGameLandmarks,
    applyEffects: establishmentsEffectsMap,
    activePlayerId: message.usersIds[0],
  };
});

const addStarterKit = assign<GameContext, GameMachineMessage>((context, message) => {
  if (message.type !== 'START_GAME') {
    return context;
  }

  const { wheatField, bakery } = context.gameEstablishments;

  if (!wheatField || !bakery) return context;

  const initialEstablishments = Object.fromEntries([[wheatField.establishmentId, 1], [bakery.establishmentId, 1]]);

  return {
    ...context,
    establishments: Object.fromEntries(context.players.map((player) => [player.userId, initialEstablishments])),
    coins: Object.fromEntries(context.players.map((player) => [player.userId, 3])),
  };
});

export const gameMachine = createMachine<GameContext, GameMachineMessage>(
  {
    id: 'game',
    initial: 'initializing',
    context: {
      gameEstablishments: {},
      gameLandmarks: {},
      shop: {},
      activePlayerId: '',
      players: [],
      establishments: {},
      landmarks: {},
      coins: {},
      rollDiceResult: 0,
      winnerId: '',
    },
    states: {
      initializing: {
        on: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          START_GAME: {
            actions: [
              'initializePlayers', 'addStarterKit',
            ],
            target: 'waitingToRollDice',
          },
        },
      },
      waitingToRollDice: {
        on: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ROLL_DICE: [
            {
              cond: 'canRollDice',
              actions: [
                'rollDice', 'applyEstablishmentEffects',
              ],
              target: 'waitingForEstablishmentConstruction',
            },
          ],
        },
      },
      waitingForEstablishmentConstruction: {
        on: {
          PASS: [
            {
              actions: [
                'chooseNextPlayer',
              ],
              target: 'checkingWinningConditions',
            },
          ],
          // eslint-disable-next-line @typescript-eslint/naming-convention
          BUILD_ESTABLISHMENT: [
            {
              cond: 'canBuildEstablishment',
              actions: ['buildEstablishment'],
              target: 'waitingForEstablishmentConstruction',
            },
            {
              cond: 'canNotBuildEstablishment',
              target: 'waitingForEstablishmentConstruction',
            },
          ],
          // eslint-disable-next-line @typescript-eslint/naming-convention
          BUILD_LANDMARK: [
            {
              cond: 'canBuildLandmark',
              actions: ['buildLandmark'],
              target: 'checkingWinningConditions',
            },
            {
              cond: 'canNotBuildLandmark',
              target: 'waitingForEstablishmentConstruction',
            },
          ],
        },
      },
      closingGame: {
        type: 'final',
      },
      checkingWinningConditions: {
        always: [
          {
            cond: 'hasWinner',
            actions: [
              'endGame',
            ],
            target: 'closingGame',
          },
          {
            cond: 'hasNoWinner',
            actions: [
              'chooseNextPlayer',
            ],
            target: 'waitingToRollDice',
          },
        ],
      },
    },
  },
  {
    guards: {
      canRollDice,
      hasWinner,
      hasNoWinner,
      canBuildEstablishment,
      canNotBuildEstablishment,
      canBuildLandmark,
      canNotBuildLandmark,
    },
    actions: {
      initializePlayers,
      addStarterKit,
      rollDice,
      applyEstablishmentEffects,
      chooseNextPlayer,
      buildEstablishment,
      buildLandmark,
      endGame,
    },
  },
);
