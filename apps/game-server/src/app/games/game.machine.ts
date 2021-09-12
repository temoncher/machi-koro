/* eslint-disable @typescript-eslint/naming-convention */
import { createMachine } from 'xstate';

type Card = {
  id: string;
  name: string;
  coin: number;
};

type PlayerCards = {
  playerId: string;
  playerCards: Card[];
};

type Player = {
  id: string;
  name: string;
  coins: number;
};

type Context = {
  currentPlayerId: string;
  players: Player[];
  playersCards: PlayerCards[];
  rollDiceResult: number;
};

const canRollDiceAndRerollDice = () => true;
const canRollDice = () => true;
const canTakeExtraTurn = () => true;
const hasEnoughCoinsAndCanTakeExtraTurn = () => true;
const hasEnoughCoins = () => true;
const hasWinner = () => false;
const hasNoWinner = () => true;
const allPlayersLeft = () => false;

const addStarterKit = () => {};
const chooseStartGamePlayer = () => {};
const applyCardEffects = () => {};
const buildEstablishment = () => {};

export const gameMachine = createMachine<Context>(
  {
    id: 'game',
    initial: 'initializing',
    context: {
      currentPlayerId: '',
      players: [],
      playersCards: [],
      rollDiceResult: 0,
    },
    states: {
      initializing: {
        entry: ['addStarterKit', 'chooseStartGamePlayer'],
        on: {
          START_GAME: 'waitingToRollDice',
        },
      },
      waitingToRollDice: {
        on: {
          ROLL_DICE: [
            {
              cond: 'canRollDiceAndRerollDice',
              actions: ['applyCardEffects'],
              target: 'waitingChoiceAboutRerollingDice',
            },
            {
              cond: 'canRollDice',
              actions: ['applyCardEffects'],
              target: 'waitingForEstablishmentConstruction',
            },
          ],
        },
      },
      waitingChoiceAboutRerollingDice: {
        on: {
          REPEATE_ROLL_DICE: 'waitingToRollDice',
          PASS: 'waitingForEstablishmentConstruction',
        },
      },
      waitingForEstablishmentConstruction: {
        on: {
          PASS: [
            {
              cond: 'canTakeExtraTurn',
              target: 'waitingChoiceAboutTakingExtraTurn',
            },
            {
              target: 'checkingWinningConditions',
            },
          ],
          BUILD_ESTABLISHMENT: [
            {
              cond: 'hasEnoughCoinsAndCanTakeExtraTurn',
              actions: ['buildEstablishment'],
              target: 'waitingChoiceAboutTakingExtraTurn',
            },
            {
              cond: 'hasEnoughCoins',
              actions: ['buildEstablishment'],
              target: 'checkingWinningConditions',
            },
          ],
        },
      },
      waitingChoiceAboutTakingExtraTurn: {
        on: {
          PASS_TAKING_EXTRA_TURN: 'checkingWinningConditions',
          TAKE_EXTRA_TURN: 'waitingToRollDice',
        },
      },
      checkingWinningConditions: {
        on: {
          always: [
            {
              cond: 'hasWinner',
              target: 'showingDashboard',
            },
            {
              cond: 'hasNoWinner',
              target: 'waitingToRollDice',
            },
          ],
        },
      },
      showingDashboard: {
        on: {
          PLAYER_LEFT: {
            cond: 'allPlayersLeft',
            target: 'closingGame',
          },
        },
      },
      closingGame: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      canRollDiceAndRerollDice,
      canRollDice,
      canTakeExtraTurn,
      hasEnoughCoinsAndCanTakeExtraTurn,
      hasEnoughCoins,
      hasWinner,
      hasNoWinner,
      allPlayersLeft,
    },
    actions: {
      addStarterKit,
      chooseStartGamePlayer,
      applyCardEffects,
      buildEstablishment,
    },
  },
);
