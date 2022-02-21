import { reducer } from 'ts-action';

import { initialGameState } from './game.state';

export const gameReducer = reducer(
  initialGameState,
);
