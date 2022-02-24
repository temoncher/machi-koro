import { UserId, Lobby } from '@machikoro/game-server-contracts';

export type CreateLobby = (hostId: UserId, capacity: number) => Promise<Lobby>;
