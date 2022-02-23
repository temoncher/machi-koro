import { UserId } from '@machikoro/game-server-contracts';

export type GetUserData = (userId: UserId) => Promise<{ username: string; userId: UserId } | undefined>;
