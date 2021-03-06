import {
  allGameEstablishments,
  allGameLandmarks,
  DiceCombination,
  Establishment,
  EstablishmentId,
  establishmentsIds,
  GameContext,
  GameMachineMessage,
  Landmark,
  LandmarkId,
  UserId,
} from '@machikoro/game-server-contracts';
import { createMachine, assign } from 'xstate';

import { establishmentsEffectsMap } from './establishments';
import { RecordUtils } from './record.utils';

const getDiceCombinationSum = (combination: DiceCombination | undefined) => {
  const [firstDice = 0, secondDice = 0] = combination ?? [];

  return firstDice + secondDice;
};

const canRollDice = (
  context: GameContext,
  message: GameMachineMessage,
) => message.type === 'ROLL_DICE' && context.activePlayerId === message.userId;

const rollDice = assign<GameContext, GameMachineMessage>({
  rolledDiceCombination: (context, message) => {
    if (message.type !== 'ROLL_DICE') {
      return context.rolledDiceCombination;
    }

    return [Math.floor((Math.random() * 6) + 1), undefined];
  },
});

const compareByOrderOfActivation = (firstEstablishment: Establishment, secondEstablishment: Establishment) => {
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
    (establishment) => establishment
      .activation
      .some((activationSum) => activationSum === getDiceCombinationSum(context.rolledDiceCombination)),
  );

  return [...establishmentsToApplyEffectsOf]
    .sort(compareByOrderOfActivation)
    .reduce((contextSoFar, establishment) => {
      const effect = establishmentsEffectsMap[establishment.establishmentId];

      if (!effect) return contextSoFar;

      return effect(contextSoFar);
    }, context);
});

const buildLandmark = assign<GameContext, GameMachineMessage>((context, message) => {
  if (message.type !== 'BUILD_LANDMARK') {
    return context;
  }

  const activePlayerLandmarks = context.landmarks[context.activePlayerId];
  const currentGameLandmark = allGameLandmarks[message.payload];

  if (!activePlayerLandmarks || !currentGameLandmark) {
    return context;
  }

  const playerWithUpdatedLandmarks = RecordUtils.modifyAt(message.payload, () => true, activePlayerLandmarks);
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

  const establishmentToBuild = message.payload;
  const currentPlayerEstablishments = context.establishments[context.activePlayerId];
  const currentGameEstablishment = allGameEstablishments[establishmentToBuild];

  if (!currentPlayerEstablishments || !currentGameEstablishment) return context;

  const playersWithUpdatedEstablishments = RecordUtils.mapWithIndex((playerId, establishments) => {
    if (playerId !== message.userId) return establishments;

    const currentEstablishmentQuantity = currentPlayerEstablishments[message.payload];

    if (currentEstablishmentQuantity === undefined) {
      return {
        ...currentPlayerEstablishments,
        [establishmentToBuild]: 1,
      };
    }

    return {
      ...currentPlayerEstablishments,
      [establishmentToBuild]: currentEstablishmentQuantity + 1,
    };
  }, context.establishments);

  const updatedCoins = RecordUtils.modifyAt(message.userId, (coins) => coins - currentGameEstablishment.cost, context.coins);

  const updatedEstablishmentsQuantity = RecordUtils.modifyAt(
    message.payload,
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
    const activePlayerIndex = context.playersIds.findIndex((userId) => userId === context.activePlayerId);
    const nextPlayerIndex = (activePlayerIndex + 1) % context.playersIds.length;
    const nextPlayerId = context.playersIds[nextPlayerIndex];

    if (!nextPlayerId) return context.activePlayerId;

    return nextPlayerId;
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
  const currentGameLandmark = allGameLandmarks[message.payload];

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
  const currentGameLandmark = allGameLandmarks[message.payload];

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
  const currentGameEstablishment = allGameEstablishments[message.payload];
  const establishmentQuantity = context.shop[message.payload];

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
  const currentGameEstablishment = allGameEstablishments[message.payload];
  const establishmentQuantity = context.shop[message.payload];

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

export const createGameMachine = (playersIds: UserId[]) => {
  const getInitialContext = (): GameContext => {
    const underConstructionLandmarks = RecordUtils.map(() => false, allGameLandmarks);
    const shop = RecordUtils.map(
      (establishment) => (establishment.domain === 'majorEstablishment' ? 5 : 6),
      allGameEstablishments,
    ) as Record<LandmarkId, number>;

    const landmarks = Object.fromEntries(playersIds.map((playerId) => [playerId, { ...underConstructionLandmarks }]));
    const establishments = Object.fromEntries(playersIds.map((playerId) => [playerId, {
      [establishmentsIds.wheatField]: 1,
      [establishmentsIds.bakery]: 1,
    }]));
    const coins = Object.fromEntries(playersIds.map((playerId) => [playerId, 3]));

    return {
      playersIds,
      landmarks,
      shop,
      activePlayerId: playersIds[0]!,
      establishments,
      coins,
      gameEstablishments: allGameEstablishments,
      gameLandmarks: allGameLandmarks,
      winnerId: undefined,
      rolledDiceCombination: undefined,
    };
  };

  return createMachine<GameContext, GameMachineMessage>(
    {
      id: 'game',
      initial: 'waitingToRollDice',
      context: getInitialContext(),
      states: {
        waitingToRollDice: {
          on: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ROLL_DICE: [
              {
                cond: 'canRollDice',
                actions: ['rollDice', 'applyEstablishmentEffects'],
                target: 'waitingForEstablishmentConstruction',
              },
            ],
          },
        },
        waitingForEstablishmentConstruction: {
          on: {
            PASS: [
              {
                actions: 'chooseNextPlayer',
                target: 'checkingWinningConditions',
              },
            ],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            BUILD_ESTABLISHMENT: [
              {
                cond: 'canBuildEstablishment',
                actions: 'buildEstablishment',
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
                actions: 'buildLandmark',
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
              actions: 'endGame',
              target: 'closingGame',
            },
            {
              cond: 'hasNoWinner',
              actions: 'chooseNextPlayer',
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
        rollDice,
        applyEstablishmentEffects,
        chooseNextPlayer,
        buildEstablishment,
        buildLandmark,
        endGame,
      },
    },
  );
};
