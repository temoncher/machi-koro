import { createMachine, assign } from 'xstate';

import { RecordUtils } from '../utils';

type Card = {
  type: 'Landmark' | 'Wheat' | 'Livestock' | 'Box' | 'Cup' | 'Gear' | 'Enterprise' | 'Apple' | 'Establishment';
  name: string;
  cost: number;
  activation: number[];
  quantity: number;
};

type Player = {
  userId: string;
};

type GameContext = {
  gameCards: Record<string, Card>;
  currentPlayerId: string;
  players: Player[];
  playersCards: Record<string, Card[]>;
  coins: Record<string, number>;
  rollDiceResult: number;
  winnerId: string;
};

const allGameCards: Record<string, Card> = {
  trainStation: {
    type: 'Landmark',
    name: 'Train Station',
    cost: 4,
    activation: [],
    quantity: 0,
  },
  shoppingMall: {
    type: 'Landmark',
    name: 'Shopping Mall',
    cost: 10,
    activation: [],
    quantity: 0,
  },
  amusementPark: {
    type: 'Landmark',
    name: 'Amusement Park',
    cost: 16,
    activation: [],
    quantity: 0,
  },
  radioTower: {
    type: 'Landmark',
    name: 'Radio tower',
    cost: 22,
    activation: [],
    quantity: 0,
  },
  wheatField: {
    type: 'Wheat',
    name: 'Wheat field',
    cost: 1,
    quantity: 6,
    activation: [1],
  },
  livestockFarm: {
    type: 'Livestock',
    name: 'Livestock Farm',
    cost: 1,
    quantity: 6,
    activation: [2],
  },
  bakery: {
    type: 'Box',
    name: 'Bakery',
    cost: 1,
    quantity: 6,
    activation: [2, 3],
  },
  Cafe: {
    type: 'Cup',
    name: 'Cafe',
    cost: 2,
    quantity: 6,
    activation: [2, 3],
  },
  convenienceStore: {
    type: 'Box',
    name: 'Convenience Store',
    cost: 2,
    quantity: 6,
    activation: [4],
  },
  forest: {
    type: 'Gear',
    name: 'Forest',
    cost: 3,
    quantity: 6,
    activation: [5],
  },
  stadium: {
    type: 'Establishment',
    name: 'Stadium',
    cost: 6,
    quantity: 5,
    activation: [6],
  },
  TVStation: {
    type: 'Establishment',
    name: 'TV Station',
    cost: 7,
    quantity: 5,
    activation: [6],
  },
  businessComplex: {
    type: 'Establishment',
    name: 'Business Complex',
    cost: 8,
    quantity: 5,
    activation: [6],
  },
  cheeseFactory: {
    type: 'Enterprise',
    name: 'Cheese Factory',
    cost: 5,
    quantity: 6,
    activation: [7],
  },
  furnitureFactory: {
    type: 'Enterprise',
    name: 'Furniture Factory',
    cost: 3,
    quantity: 6,
    activation: [8],
  },
  mine: {
    type: 'Gear',
    name: 'Mine',
    cost: 6,
    quantity: 6,
    activation: [9],
  },
  restaurant: {
    type: 'Cup',
    name: 'Restaurant',
    cost: 3,
    quantity: 6,
    activation: [9, 10],
  },
  appleOrchard: {
    type: 'Wheat',
    name: 'Apple Orchard',
    cost: 3,
    quantity: 6,
    activation: [10],
  },
  produceMarket: {
    type: 'Apple',
    name: 'Produce Market',
    cost: 2,
    quantity: 6,
    activation: [11, 12],
  },
};

type RollDiceMessage = {
  type: 'ROLL_DICE';
  userId: string;
};
type StartGame = {
  type: 'START_GAME';
  usersIds: string[];
};

type SimpleGameMachineMessage =
  | RollDiceMessage
  | StartGame;

const canRollDice = (
  context: GameContext,
  message: SimpleGameMachineMessage,
) => message.type === 'ROLL_DICE' && context.currentPlayerId === message.userId;

const rollDice = assign<GameContext, SimpleGameMachineMessage>({
  rollDiceResult: (context, message) => {
    if (message.type === 'ROLL_DICE') {
      return Math.floor((Math.random() * 6) + 1);
    }

    return context.rollDiceResult;
  },
});

const applyCardEffects = assign<GameContext, SimpleGameMachineMessage>({
  coins: (context, message) => {
    if (message.type === 'ROLL_DICE') {
      return RecordUtils.modifyAt(
        context.currentPlayerId,
        (coins) => coins + context.rollDiceResult,
        context.coins,
      );
    }

    return context.coins;
  },
});

const chooseNextPlayer = assign<GameContext, SimpleGameMachineMessage>({
  currentPlayerId: (context) => {
    const currentPlayerIndex = context.players.findIndex((player) => player.userId === context.currentPlayerId);

    if (currentPlayerIndex === context.players.length - 1) {
      const firstPlayer = context.players[0];

      if (!firstPlayer) {
        return context.currentPlayerId;
      }

      return firstPlayer.userId;
    }

    const nextPlayer = context.players[currentPlayerIndex + 1];

    if (!nextPlayer) {
      return context.currentPlayerId;
    }

    return nextPlayer.userId;
  },
});

const hasWinner = (context: GameContext) => {
  const currentPlayerCoins = context.coins[context.currentPlayerId];

  return !!currentPlayerCoins && currentPlayerCoins >= 52;
};

const hasNoWinner = (context: GameContext) => {
  const currentPlayerCoins = context.coins[context.currentPlayerId];

  return !!currentPlayerCoins && currentPlayerCoins < 52;
};

const endGame = assign<GameContext, SimpleGameMachineMessage>({ winnerId: (context) => context.currentPlayerId });

const initializePlayers = assign<GameContext, SimpleGameMachineMessage>((context, message) => {
  if (message.type === 'START_GAME') {
    return {
      players: message.usersIds.map((userId) => ({ userId })),
      gameCards: allGameCards,
      currentPlayerId: message.usersIds[0],
    };
  }

  return { players: context.players };
});

const addStarterKit = assign<GameContext, SimpleGameMachineMessage>((context, message) => {
  if (message.type === 'START_GAME') {
    const { wheatField, bakery } = context.gameCards;

    if (wheatField && bakery) {
      const initialCards = [wheatField, bakery];

      return {
        playersCards: Object.fromEntries(context.players.map((player) => [player.userId, initialCards])),
        coins: Object.fromEntries(context.players.map((player) => [player.userId, 3])),
      };
    }
  }

  return { playersCards: context.playersCards, coins: context.coins };
});

export const gameMachine = createMachine<GameContext, SimpleGameMachineMessage >(
  {
    id: 'game',
    initial: 'initializing',
    context: {
      gameCards: {},
      currentPlayerId: '',
      players: [],
      playersCards: {},
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
                'rollDice', 'applyCardEffects',
              ],
              target: 'checkingWinningConditions',
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
    },
    actions: {
      initializePlayers,
      addStarterKit,
      rollDice,
      applyCardEffects,
      chooseNextPlayer,
      endGame,
    },
  },
);
