import {
  establishmentsIds, allGameEstablishments, GameContext, UserId, landmarksIds, allGameLandmarks,
} from '@machikoro/game-server-contracts';

import { DiceCombination } from '../types/Dice';

const firstPlayerId = 'firstPlayer' as UserId;
const secondPlayerId = 'secondPlayer' as UserId;
const thirdPlayerId = 'thirdPlayer' as UserId;
const fourthPlayerId = 'fourthPlayer' as UserId;

export const mockGameContext: GameContext = {
  gameEstablishments: {
    [establishmentsIds.wheatField]: allGameEstablishments[establishmentsIds.wheatField]!,
    [establishmentsIds.bakery]: allGameEstablishments[establishmentsIds.bakery]!,
    [establishmentsIds.livestockFarm]: allGameEstablishments[establishmentsIds.livestockFarm]!,
    [establishmentsIds.cafe]: allGameEstablishments[establishmentsIds.cafe]!,
  },
  shop: {
    [establishmentsIds.bakery]: 10,
    [establishmentsIds.wheatField]: 13,
    [establishmentsIds.livestockFarm]: 5,
    [establishmentsIds.cafe]: 2,
  },
  activePlayerId: firstPlayerId,
  playersIds: [firstPlayerId, secondPlayerId, thirdPlayerId, fourthPlayerId],
  establishments: {
    [firstPlayerId]: {},
    [secondPlayerId]: {},
    [thirdPlayerId]: {},
    [fourthPlayerId]: {},
  },
  coins: {
    [firstPlayerId]: 54,
    [secondPlayerId]: 3,
    [thirdPlayerId]: 3,
    [fourthPlayerId]: 20,
  },
  landmarks: {
    [firstPlayerId]: {
      [landmarksIds.trainStation]: false,
      [landmarksIds.shoppingMall]: false,
      [landmarksIds.amusementPark]: false,
      [landmarksIds.radioTower]: false,
    },
    [secondPlayerId]: {},
    [thirdPlayerId]: {},
    [fourthPlayerId]: {
      [landmarksIds.trainStation]: false,
      [landmarksIds.shoppingMall]: false,
      [landmarksIds.amusementPark]: false,
      [landmarksIds.radioTower]: false,
    },
  },
  gameLandmarks: {
    [landmarksIds.trainStation]: allGameLandmarks[landmarksIds.trainStation]!,
    [landmarksIds.shoppingMall]: allGameLandmarks[landmarksIds.shoppingMall]!,
    [landmarksIds.amusementPark]: allGameLandmarks[landmarksIds.amusementPark]!,
    [landmarksIds.radioTower]: allGameLandmarks[landmarksIds.radioTower]!,
  },
  rollDiceResult: 3,
  winnerId: undefined,
};

export const mockRolledDiceCombination: DiceCombination = [3, undefined];
