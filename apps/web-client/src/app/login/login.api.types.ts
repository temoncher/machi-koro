import { UserId } from '@machikoro/game-server-contracts';

export type RegisterGuest = (username: string) => Promise<{ userId: UserId; username: string }>;
