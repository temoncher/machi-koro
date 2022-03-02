import { EstablishmentEffect, EstablishmentId, establishmentsIds } from '@machikoro/game-server-contracts';

import {
  updateCoinsForActivePlayerWith,
  updateCoinsForActivePlayerWithIndustryEstablishment,
  updateCoinsForAllPlayersAtTheExpenseOfActivePlayer,
  updateCoinsForAllPlayersWith,
} from './establishments-effects';

export const establishmentsEffectsMap: Record<EstablishmentId, EstablishmentEffect> = {
  [establishmentsIds.wheatField]: updateCoinsForAllPlayersWith(establishmentsIds.wheatField, 1),
  [establishmentsIds.livestockFarm]: updateCoinsForAllPlayersWith(establishmentsIds.livestockFarm, 1),
  [establishmentsIds.bakery]: updateCoinsForActivePlayerWith(establishmentsIds.bakery, 1),
  [establishmentsIds.cafe]: updateCoinsForAllPlayersAtTheExpenseOfActivePlayer(establishmentsIds.cafe, 1),
  [establishmentsIds.convenienceStore]: updateCoinsForActivePlayerWith(establishmentsIds.convenienceStore, 3),
  [establishmentsIds.forest]: updateCoinsForAllPlayersWith(establishmentsIds.forest, 1),
  [establishmentsIds.cheeseFactory]: updateCoinsForActivePlayerWithIndustryEstablishment(establishmentsIds.cheeseFactory, 3, 'livestock'),
  [establishmentsIds.furnitureFactory]: updateCoinsForActivePlayerWithIndustryEstablishment(establishmentsIds.furnitureFactory, 3, 'gear'),
  [establishmentsIds.mine]: updateCoinsForAllPlayersWith(establishmentsIds.mine, 5),
  [establishmentsIds.restaurant]: updateCoinsForAllPlayersAtTheExpenseOfActivePlayer(establishmentsIds.restaurant, 2),
  [establishmentsIds.appleOrchard]: updateCoinsForAllPlayersWith(establishmentsIds.appleOrchard, 3),
  [establishmentsIds.produceMarket]: updateCoinsForActivePlayerWithIndustryEstablishment(establishmentsIds.produceMarket, 2, 'wheat'),
};
