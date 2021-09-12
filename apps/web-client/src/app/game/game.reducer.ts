import { GameAction, GameActionTypes } from './game.actions';
import { initialGameState, GameState } from './game.state';

// eslint-disable-next-line @typescript-eslint/default-param-last
export const gameReducer = (state: GameState = initialGameState, action: GameAction): GameState => {
  switch (action.type) {
    case GameActionTypes.SET_GAME_ID: {
      return {
        ...state,
        gameId: action.payload,
      };
    }

    default:
      return state;
  }
};
