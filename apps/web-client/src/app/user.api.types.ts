import { UserId } from '@machikoro/game-server-contracts';

export type RegisterUser = (username: string) => Promise<{ username: string; userId: UserId }>;
export type GetUserData = (userId: UserId) => Promise<{ username: string; userId: UserId } | undefined>;
