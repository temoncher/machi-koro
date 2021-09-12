/* eslint-disable @typescript-eslint/naming-convention */
import { createMachine, assign } from 'xstate';

type Card = {
  type: string;
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
    type: 'landmark',
    name: 'Train Station',
    cost: 4,
    activation: [],
    quantity: 0,
  },
  shoppingMall: {
    type: 'landmark',
    name: 'Shopping Mall',
    cost: 10,
    activation: [],
    quantity: 0,
  },
  amusementPark: {
    type: 'landmark',
    name: 'Amusement Park',
    cost: 16,
    activation: [],
    quantity: 0,
  },
  radioTower: {
    type: 'landmark',
    name: 'Radio tower',
    cost: 22,
    activation: [],
    quantity: 0,
  },
  wheatField: {
    type: 'Primary Industry',
    name: 'Wheat field',
    cost: 1,
    activation: [1],
    quantity: 6,
  },
  ranch: {
    type: 'Primary Industry',
    name: 'Ranch',
    cost: 1,
    quantity: 6,
    activation: [2],
  },
  forest: {
    type: 'Primary Industry',
    name: 'Forest',
    cost: 3,
    quantity: 6,
    activation: [5],
  },
  mine: {
    type: 'Primary Industry',
    name: 'Mine',
    cost: 6,
    quantity: 6,
    activation: [9],
  },
  appleOrchard: {
    type: 'Primary Industry',
    name: 'Apple Orchard',
    cost: 3,
    quantity: 6,
    activation: [10],
  },
  bakery:
  {
    type: 'Secondary Industry',
    name: 'Bakery',
    cost: 1,
    quantity: 6,
    activation: [2, 3],
  },
  convenienceStore: {
    type: 'Secondary Industry',
    name: 'Convenience Store',
    cost: 2,
    quantity: 6,
    activation: [4],
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
    const userListLandmark = currentPlayerCards.filter((card) => card.type === 'landmark');

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
