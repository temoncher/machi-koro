import { EstablishmentEffect, EstablishmentId } from '@machikoro/game-server-contracts';

import {
  updateCoinsForActivePlayerWith,
  updateCoinsForActivePlayerWithIndustryEstablishment,
  updateCoinsForAllPlayersAtTheExpenseOfActivePlayer,
  updateCoinsForAllPlayersWith,
} from './establishment-effects';

export const establishmentsEffectsMap: Record<EstablishmentId, EstablishmentEffect> = {
  wheatField: updateCoinsForAllPlayersWith('wheatField', 1),
  livestockFarm: updateCoinsForAllPlayersWith('livestockFarm', 1),
  bakery: updateCoinsForActivePlayerWith('bakery', 1),
  cafe: updateCoinsForAllPlayersAtTheExpenseOfActivePlayer('cafe', 1),
  convenienceStore: updateCoinsForActivePlayerWith('convenienceStore', 3),
  forest: updateCoinsForAllPlayersWith('forest', 1),
  cheeseFactory: updateCoinsForActivePlayerWithIndustryEstablishment('cheeseFactory', 3, 'livestock'),
  furnitureFactory: updateCoinsForActivePlayerWithIndustryEstablishment('furnitureFactory', 3, 'gear'),
  mine: updateCoinsForAllPlayersWith('mine', 5),
  restaurant: updateCoinsForAllPlayersAtTheExpenseOfActivePlayer('restaurant', 2),
  appleOrchard: updateCoinsForAllPlayersWith('appleOrchard', 3),
  produceMarket: updateCoinsForActivePlayerWithIndustryEstablishment('produceMarket', 2, 'wheat'),
};
