import {
  allGameEstablishments,
  allGameLandmarks,
  establishmentsIds,
  GameContext,
  UserId,
} from '@machikoro/game-server-contracts';

import {
  updateCoinsForAllPlayersWith,
  updateCoinsForActivePlayerWith,
  updateCoinsForActivePlayerWithIndustryEstablishment,
  updateCoinsForAllPlayersAtTheExpenseOfActivePlayer,
} from './establishments-effects';

const mockPlayerIds = {
  firstPlayer: 'firstPlayer' as UserId,
  secondPlayer: 'secondPlayer' as UserId,
  thirdPlayer: 'thirdPlayer' as UserId,
  fourthPlayer: 'fourthPlayer' as UserId,
} as const;

const mockedPlayers = [
  { userId: mockPlayerIds.firstPlayer },
  { userId: mockPlayerIds.secondPlayer },
  { userId: mockPlayerIds.thirdPlayer },
  { userId: mockPlayerIds.fourthPlayer },
];

describe('Establishments effects', () => {
  describe('updateCoinsForAllPlayersWith', () => {
    test('should update coins for multiple players with the current establishment', () => {
      // arrange
      const previousContext: GameContext = {
        players: mockedPlayers,
        landmarks: {
          [mockPlayerIds.firstPlayer]: {},
          [mockPlayerIds.secondPlayer]: {},
          [mockPlayerIds.thirdPlayer]: {},
          [mockPlayerIds.fourthPlayer]: {},
        },
        establishments: {
          [mockPlayerIds.firstPlayer]: {
            [establishmentsIds.wheatField]: 1,
          },
          [mockPlayerIds.secondPlayer]: {
            [establishmentsIds.wheatField]: 2,
          },
          [mockPlayerIds.thirdPlayer]: {
            [establishmentsIds.wheatField]: 2,
          },
          [mockPlayerIds.fourthPlayer]: {},
        },
        coins: {
          [mockPlayerIds.firstPlayer]: 3,
          [mockPlayerIds.secondPlayer]: 5,
          [mockPlayerIds.thirdPlayer]: 1,
          [mockPlayerIds.fourthPlayer]: 9,
        },
        activePlayerId: mockPlayerIds.firstPlayer,
        rollDiceResult: 1,
        winnerId: undefined,
        gameEstablishments: allGameEstablishments,
        gameLandmarks: allGameLandmarks,
        shop: {},
      };

      // act
      const updatedContext = updateCoinsForAllPlayersWith(establishmentsIds.wheatField, 1)(previousContext);

      // assert
      const expectedContext: GameContext = {
        ...previousContext,
        coins: {
          [mockPlayerIds.firstPlayer]: 4,
          [mockPlayerIds.secondPlayer]: 7,
          [mockPlayerIds.thirdPlayer]: 3,
          [mockPlayerIds.fourthPlayer]: 9,
        },
      };

      expect(updatedContext).toStrictEqual(expectedContext);
    });
  });

  describe('updateCoinsForActivePlayerWith', () => {
    test('should update coins for the first player and not update coins for the second player', () => {
      // arrange
      const previousContext: GameContext = {
        players: mockedPlayers,
        landmarks: {
          [mockPlayerIds.firstPlayer]: {},
          [mockPlayerIds.secondPlayer]: {},
          [mockPlayerIds.thirdPlayer]: {},
          [mockPlayerIds.fourthPlayer]: {},
        },
        establishments: {
          [mockPlayerIds.firstPlayer]: {
            [establishmentsIds.convenienceStore]: 2,
          },
          [mockPlayerIds.secondPlayer]: {
            [establishmentsIds.convenienceStore]: 1,
          },
          [mockPlayerIds.thirdPlayer]: {},
          [mockPlayerIds.fourthPlayer]: {},
        },
        coins: {
          [mockPlayerIds.firstPlayer]: 3,
          [mockPlayerIds.secondPlayer]: 5,
          [mockPlayerIds.thirdPlayer]: 1,
          [mockPlayerIds.fourthPlayer]: 9,
        },
        activePlayerId: mockPlayerIds.firstPlayer,
        rollDiceResult: 4,
        winnerId: undefined,
        gameEstablishments: allGameEstablishments,
        gameLandmarks: allGameLandmarks,
        shop: {},
      };

      // act
      const updatedContext = updateCoinsForActivePlayerWith(establishmentsIds.convenienceStore, 3)(previousContext);

      // assert
      const expectedContext: GameContext = {
        ...previousContext,
        coins: {
          [mockPlayerIds.firstPlayer]: 9,
          [mockPlayerIds.secondPlayer]: 5,
          [mockPlayerIds.thirdPlayer]: 1,
          [mockPlayerIds.fourthPlayer]: 9,
        },
      };

      expect(updatedContext).toStrictEqual(expectedContext);
    });
  });

  describe('updateCoinsForActivePlayerWithIndustryEstablishment', () => {
    test('should update coins for the first player and not update coins for the second player', () => {
      // arrange
      const previousContext: GameContext = {
        players: mockedPlayers,
        landmarks: {
          [mockPlayerIds.firstPlayer]: {},
          [mockPlayerIds.secondPlayer]: {},
        },
        establishments: {
          [mockPlayerIds.firstPlayer]: {
            [establishmentsIds.livestockFarm]: 2,
            [establishmentsIds.cheeseFactory]: 1,
          },
          [mockPlayerIds.secondPlayer]: {
            [establishmentsIds.cheeseFactory]: 2,
          },
          [mockPlayerIds.thirdPlayer]: {
            [establishmentsIds.livestockFarm]: 3,
            [establishmentsIds.cheeseFactory]: 1,
          },
          [mockPlayerIds.fourthPlayer]: {},
        },
        coins: {
          [mockPlayerIds.firstPlayer]: 3,
          [mockPlayerIds.secondPlayer]: 5,
          [mockPlayerIds.thirdPlayer]: 1,
          [mockPlayerIds.fourthPlayer]: 9,
        },
        activePlayerId: mockPlayerIds.firstPlayer,
        rollDiceResult: 7,
        winnerId: undefined,
        gameEstablishments: allGameEstablishments,
        gameLandmarks: allGameLandmarks,
        shop: {},
      };

      // act
      const updatedContext = updateCoinsForActivePlayerWithIndustryEstablishment(
        establishmentsIds.cheeseFactory,
        3,
        'livestock',
      )(previousContext);

      // assert
      const expectedContext: GameContext = {
        ...previousContext,
        coins: {
          [mockPlayerIds.firstPlayer]: 9,
          [mockPlayerIds.secondPlayer]: 5,
          [mockPlayerIds.thirdPlayer]: 1,
          [mockPlayerIds.fourthPlayer]: 9,
        },
      };

      expect(updatedContext).toStrictEqual(expectedContext);
    });
  });

  describe('updateCoinsForAllPlayersAtTheExpenseOfActivePlayer', () => {
    test("must update the second player's coins by removing the first player's coins", () => {
      // arrange
      const previousContext: GameContext = {
        players: mockedPlayers,
        landmarks: {
          [mockPlayerIds.firstPlayer]: {},
          [mockPlayerIds.secondPlayer]: {},
          [mockPlayerIds.thirdPlayer]: {},
          [mockPlayerIds.fourthPlayer]: {},
        },
        establishments: {
          [mockPlayerIds.firstPlayer]: {
            [establishmentsIds.cafe]: 2,
          },
          [mockPlayerIds.secondPlayer]: {
            [establishmentsIds.cafe]: 2,
          },
          [mockPlayerIds.thirdPlayer]: {},
          [mockPlayerIds.fourthPlayer]: {
            [establishmentsIds.cafe]: 2,
          },
        },
        coins: {
          [mockPlayerIds.firstPlayer]: 5,
          [mockPlayerIds.secondPlayer]: 3,
          [mockPlayerIds.thirdPlayer]: 1,
          [mockPlayerIds.fourthPlayer]: 9,
        },
        activePlayerId: mockPlayerIds.secondPlayer,
        rollDiceResult: 3,
        winnerId: undefined,
        gameEstablishments: allGameEstablishments,
        gameLandmarks: allGameLandmarks,
        shop: {},
      };

      // act
      const updatedContext = updateCoinsForAllPlayersAtTheExpenseOfActivePlayer(establishmentsIds.cafe, 1)(previousContext);

      // assert
      const expectedContext: GameContext = {
        ...previousContext,
        coins: {
          [mockPlayerIds.firstPlayer]: 6,
          [mockPlayerIds.secondPlayer]: 0,
          [mockPlayerIds.thirdPlayer]: 1,
          [mockPlayerIds.fourthPlayer]: 11,
        },
      };

      expect(updatedContext).toStrictEqual(expectedContext);
    });
  });
});
