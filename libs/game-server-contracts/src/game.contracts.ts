import { z } from 'zod';

const MAX_LENGTH_LOBBY_ID = 36;

export enum UserStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export type UsersStatusesMap = Record<string, UserStatus >;

export type Game = {
  gameId: string;
  hostId: string;
  users: string[];
  usersStatusesMap: UsersStatusesMap;
};

export type CreateGameResponse = {
  gameId: string;
};

export const createGameRequestBodySchema = z.object({
  lobbyId: z
    .string()
    .max(MAX_LENGTH_LOBBY_ID, {
      message: `'lobbyId' should be at most ${String(MAX_LENGTH_LOBBY_ID)} characters long`,
    }),
});

export type CreateGameRequestBody = z.infer<typeof createGameRequestBodySchema>;
