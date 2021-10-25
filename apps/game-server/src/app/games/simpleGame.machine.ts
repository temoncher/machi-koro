/* eslint-disable @typescript-eslint/naming-convention */
import { createMachine, assign } from 'xstate';

type Card = {
  type: 'Landmark' | 'Wheat' | 'Livestock' | 'Box' | 'Cup' | 'Gear' | 'Enterprise' | 'Apple' | 'Establishment';
  name: string;
  cost: number;
  activation: number[];
  quantity: number;
};

type Player = {
  userId: string;
  coins: number;
};

type GameContext = {
  gameCards: Record<string, Card>;
  currentPlayerId: string;
  players: Player[];
  playersCards: Record<string, Card[]>;
  rollDiceResult: number;
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

const canRollDice = (context: GameContext, message: SimpleGameMachineMessage) => {
  if (message.type === 'ROLL_DICE') {
    return context.currentPlayerId === message.userId;
  }

  return false;
};

const rollDice = assign((context: GameContext, message: SimpleGameMachineMessage) => {
  if (message.type === 'ROLL_DICE') {
    return { rollDiceResult: Math.floor((Math.random() * 6) + 1) };
  }

  return { rollDiceResult: context.rollDiceResult };
});

const chooseNextPlayer = assign((context: GameContext, message: SimpleGameMachineMessage) => {
  if (message.type === 'START_GAME') {
    const currentPlayerIndex = context.players.findIndex((player) => player.userId === context.currentPlayerId);

    if (currentPlayerIndex === context.players.length - 1) {
      return { currentPlayerId: context.players[0]?.userId as string };
    }

    const nextPlayerIndex = currentPlayerIndex + 1;

    return { currentPlayerId: context.players[nextPlayerIndex]?.userId as string };
  }

  return { currentPlayerId: context.currentPlayerId };
});

const hasWinner = (context: GameContext) => {
  const currentPlayerCards = context.playersCards[context.currentPlayerId];

  if (currentPlayerCards) {
    const userListLandmark = currentPlayerCards.filter((card) => card.type === 'Landmark');

    return userListLandmark.length === 4;
  }

  return false;
};

const initializePlayers = assign((context: GameContext, message: SimpleGameMachineMessage) => {
  if (message.type === 'START_GAME') {
    return {
      players: message.usersIds.map((userId) => ({ userId, coins: 3 })),
      gameCards: allGameCards,
      currentPlayerId: message.usersIds[0],
    };
  }

  return { players: context.players };
});

const addStarterKit = assign((context: GameContext, message: SimpleGameMachineMessage) => {
  if (message.type === 'START_GAME') {
    const { wheatField, bakery } = context.gameCards;

    if (wheatField && bakery) {
      const initialCards = [wheatField, bakery];

      return {
        playersCards: Object.fromEntries(context.players.map((player) => [player.userId, initialCards])),
      };
    }
  }

  return { playersCards: context.playersCards };
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
      rollDiceResult: 0,
    },
    states: {
      initializing: {
        on: {
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
          ROLL_DICE: [
            {
              cond: 'canRollDice',
              actions: [
                'rollDice',
                'applyCardEffects',
                'chooseNextPlayer',
              ],
              target: 'waitingToRollDice',
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      canRollDice,
      hasWinner,
    },
    actions: {
      initializePlayers,
      addStarterKit,
      rollDice,
      chooseNextPlayer,
    },
  },
);
