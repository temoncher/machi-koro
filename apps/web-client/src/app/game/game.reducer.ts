import { on, reducer } from 'ts-action';

import { GameAction } from './game.actions';
import { initialGameState } from './game.state';

export const gameReducer = reducer(
  initialGameState,
  on(GameAction.setGameDocument, (state, action) => ({
    ...state,
    game: action.payload,
  })),
);
