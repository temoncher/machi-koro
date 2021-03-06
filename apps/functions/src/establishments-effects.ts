import { ApplyEffects, UserId } from '@machikoro/game-server-contracts';

import { ArrayUtils } from './array.utils';
import { RecordUtils } from './record.utils';

export const updateCoinsForAllPlayersWith: ApplyEffects = (
  establishmentId,
  income,
) => (context) => {
  const updatedCoins = RecordUtils.mapWithIndex((playerId, coins) => {
    const currentEstablishmentQuantity = context.establishments[playerId as UserId]?.[establishmentId];

    if (!currentEstablishmentQuantity) return coins;

    return coins + income * currentEstablishmentQuantity;
  }, context.coins);

  return { ...context, coins: updatedCoins };
};

export const updateCoinsForActivePlayerWith: ApplyEffects = (
  establishmentId,
  income,
) => (context) => {
  const updatedCoins = RecordUtils.mapWithIndex((playerId, coins) => {
    if (playerId !== context.activePlayerId) return coins;

    const currentEstablishmentQuantity = context.establishments[playerId as UserId]?.[establishmentId];

    if (!currentEstablishmentQuantity) return coins;

    return coins + income * currentEstablishmentQuantity;
  }, context.coins);

  return { ...context, coins: updatedCoins };
};

export const updateCoinsForActivePlayerWithIndustryEstablishment: ApplyEffects = (
  establishmentId,
  income,
  activetedEstablishmentType,
) => (context) => {
  const activatedEstablishments = Object.values(context.gameEstablishments).filter(
    (establishment) => establishment.tag === activetedEstablishmentType,
  );

  const updatedCoins = RecordUtils.mapWithIndex((playerId, coins) => {
    if (playerId !== context.activePlayerId) return coins;

    const currentPlayerEstablishments = context.establishments[playerId as UserId];

    if (!currentPlayerEstablishments) return coins;

    const currentEstablishmentQuantity = currentPlayerEstablishments[establishmentId];

    if (!currentEstablishmentQuantity) return coins;

    const establishmentsCount = activatedEstablishments.reduce(
      (establishmentsCountSoFar, establishment) => {
        const currentQuantity = currentPlayerEstablishments[establishment.establishmentId];

        if (currentQuantity === undefined) return establishmentsCountSoFar;

        return establishmentsCountSoFar + currentQuantity;
      },
      0,
    );

    return coins + income * establishmentsCount * currentEstablishmentQuantity;
  }, context.coins);

  return { ...context, coins: updatedCoins };
};

export const updateCoinsForAllPlayersAtTheExpenseOfActivePlayer: ApplyEffects = (
  establishmentId,
  income,
) => (context) => {
  const activePlayerIndex = context.playersIds.findIndex((userId) => userId === context.activePlayerId);
  const [playersBeforeActivePlayer, [, ...playersAfterActivePlayer]] = ArrayUtils.splitAt(activePlayerIndex, context.playersIds);
  const playersInOrderOfDebtCollection = [...playersAfterActivePlayer, ...playersBeforeActivePlayer];
  const activePlayerCoins = context.coins[context.activePlayerId];

  if (!activePlayerCoins) return context;

  const updatedCoins = playersInOrderOfDebtCollection.reduce(
    (coinsSoFar, currentPlayerId) => {
      const currentPlayerCoins = context.coins[currentPlayerId];

      if (currentPlayerCoins === undefined) return coinsSoFar;

      const currentEstablishmentQuantity = context.establishments[currentPlayerId]?.[establishmentId];

      if (!currentEstablishmentQuantity) {
        return {
          ...coinsSoFar,
          [currentPlayerId]: currentPlayerCoins,
        };
      }

      const activePlayerCoinsSoFar = coinsSoFar[context.activePlayerId];

      if (activePlayerCoinsSoFar === undefined) {
        return {
          ...coinsSoFar,
          [currentPlayerId]: currentPlayerCoins,
        };
      }

      const activePlayerDebt = income * currentEstablishmentQuantity;
      const amountOfCoinsToTransfer = Math.min(activePlayerDebt, activePlayerCoinsSoFar);

      return {
        ...coinsSoFar,
        [currentPlayerId]: currentPlayerCoins + amountOfCoinsToTransfer,
        [context.activePlayerId]: activePlayerCoinsSoFar - amountOfCoinsToTransfer,
      };
    },
    { [context.activePlayerId]: activePlayerCoins },
  );

  return { ...context, coins: updatedCoins };
};
