import { GameId, User } from '@machikoro/game-server-contracts';

export type JoinGame = (user: User, gameId: GameId) => Promise<GameId>;
export type AbandonGame = (user: User, gameId: GameId) => Promise<GameId>;
