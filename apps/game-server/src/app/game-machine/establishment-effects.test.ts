import {
  allGameEstablishments,
  allGameLandmarks,
  GameContext,
} from '@machikoro/game-server-contracts';

import {
  updateCoinsForAllPlayersWith,
  updateCoinsForActivePlayerWith,
  updateCoinsForActivePlayerWithIndustryEstablishment,
  updateCoinsForAllPlayersAtTheExpenseOfActivePlayer,
} from './establishment-effects';

const mockedPlayers = [
  { userId: 'firstPlayer' },
  { userId: 'secondPlayer' },
  { userId: 'thirdPlayer' },
  { userId: 'fourthPlayer' },
];

describe('Establishments effects', () => {
  describe('updateCoinsForAllPlayersWith', () => {
    test('should update coins for multiple players with the current establishment', () => {
      // arrange
      const previousContext: GameContext = {
        players: mockedPlayers,
        landmarks: {
          firstPlayer: {},
          secondPlayer: {},
          thirdPlayer: {},
          fourthPlayer: {},
        },
        establishments: {
          firstPlayer: {
            wheatField: 1,
          },
          secondPlayer: {
            wheatField: 2,
          },
          thirdPlayer: {
            wheatField: 2,
          },
          fourthPlayer: {},
        },
        coins: {
          firstPlayer: 3,
          secondPlayer: 5,
          thirdPlayer: 1,
          fourthPlayer: 9,
        },
        activePlayerId: 'firstPlayer',
        rollDiceResult: 1,
        winnerId: '',
        gameEstablishments: allGameEstablishments,
        gameLandmarks: allGameLandmarks,
        shop: {},
      };

      // act
      const updatedContext = updateCoinsForAllPlayersWith('wheatField', 1)(previousContext);

      // assert
      const expectedContext: GameContext = {
        ...previousContext,
        coins: {
          firstPlayer: 4,
          secondPlayer: 7,
          thirdPlayer: 3,
          fourthPlayer: 9,
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
          firstPlayer: {},
          secondPlayer: {},
          thirdPlayer: {},
          fourthPlayer: {},
        },
        establishments: {
          firstPlayer: {
            convenienceStore: 2,
          },
          secondPlayer: {
            convenienceStore: 1,
          },
          thirdPlayer: {},
          fourthPlayer: {},
        },
        coins: {
          firstPlayer: 3,
          secondPlayer: 5,
          thirdPlayer: 1,
          fourthPlayer: 9,
        },
        activePlayerId: 'firstPlayer',
        rollDiceResult: 4,
        winnerId: '',
        gameEstablishments: allGameEstablishments,
        gameLandmarks: allGameLandmarks,
        shop: {},
      };

      // act
      const updatedContext = updateCoinsForActivePlayerWith('convenienceStore', 3)(previousContext);

      // assert
      const expectedContext: GameContext = {
        ...previousContext,
        coins: {
          firstPlayer: 9,
          secondPlayer: 5,
          thirdPlayer: 1,
          fourthPlayer: 9,
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
          firstPlayer: {},
          secondPlayer: {},
        },
        establishments: {
          firstPlayer: {
            livestockFarm: 2,
            cheeseFactory: 1,
          },
          secondPlayer: {
            cheeseFactory: 2,
          },
          thirdPlayer: {
            livestockFarm: 3,
            cheeseFactory: 1,
          },
          fourthPlayer: {},
        },
        coins: {
          firstPlayer: 3,
          secondPlayer: 5,
          thirdPlayer: 1,
          fourthPlayer: 9,
        },
        activePlayerId: 'firstPlayer',
        rollDiceResult: 7,
        winnerId: '',
        gameEstablishments: allGameEstablishments,
        gameLandmarks: allGameLandmarks,
        shop: {},
      };

      // act
      const updatedContext = updateCoinsForActivePlayerWithIndustryEstablishment('cheeseFactory', 3, 'livestock')(previousContext);

      // assert
      const expectedContext: GameContext = {
        ...previousContext,
        coins: {
          firstPlayer: 9,
          secondPlayer: 5,
          thirdPlayer: 1,
          fourthPlayer: 9,
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
          firstPlayer: {},
          secondPlayer: {},
          thirdPlayer: {},
          fourthPlayer: {},
        },
        establishments: {
          firstPlayer: {
            cafe: 2,
          },
          secondPlayer: {
            cafe: 2,
          },
          thirdPlayer: {},
          fourthPlayer: {
            cafe: 2,
          },
        },
        coins: {
          firstPlayer: 5,
          secondPlayer: 3,
          thirdPlayer: 1,
          fourthPlayer: 9,
        },
        activePlayerId: 'secondPlayer',
        rollDiceResult: 3,
        winnerId: '',
        gameEstablishments: allGameEstablishments,
        gameLandmarks: allGameLandmarks,
        shop: {},
      };

      // act
      const updatedContext = updateCoinsForAllPlayersAtTheExpenseOfActivePlayer('cafe', 1)(previousContext);

      // assert
      const expectedContext: GameContext = {
        ...previousContext,
        coins: {
          firstPlayer: 6,
          secondPlayer: 0,
          thirdPlayer: 1,
          fourthPlayer: 11,
        },
      };

      expect(updatedContext).toStrictEqual(expectedContext);
    });
  });
});
