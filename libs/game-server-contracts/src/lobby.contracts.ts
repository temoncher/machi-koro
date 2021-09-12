import { z } from 'zod';

import { userSchema } from './user.model';

export type CreateLobbyResponse = {
  lobbyId: string;
};

export type CreateLobbyRequestBody = {
  hostId: string;
};

export const registerGuestRequestBodySchema = userSchema.omit({ userId: true });

export type RegisterGuestRequestBody = z.infer<typeof registerGuestRequestBodySchema>;

export type Lobby = {
  hostId: string;
  users: string[];
};

export const validateLobby = (lobby: Lobby | undefined): Lobby | undefined => {
  if (!lobby || lobby.users.length > 3) {
    return undefined;
  }

  return lobby;
};
