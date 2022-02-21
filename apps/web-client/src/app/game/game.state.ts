import { Game } from '@machikoro/game-server-contracts';

export type GameState = {
  game: Game | undefined;
};

export const initialGameState: GameState = {
  game: undefined,
};
