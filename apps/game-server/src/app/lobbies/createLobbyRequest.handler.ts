import { CreateLobbyResponse, Lobby, ServerError } from '@machikoro/game-server-contracts';
import { RequestHandler } from 'express';

import { AuthMiddlewareLocals } from '../shared';
import { HTTPStatusCode } from '../types';

type CreateLobbyRequestHandler = RequestHandler<
Record<string, string>,
CreateLobbyResponse | ServerError,
Record<string, unknown>,
Record<string, unknown>,
AuthMiddlewareLocals
>;

export type CreateLobbyRequestHandlerDependencies = {
  createLobby: (hostId: string) => Promise<Lobby & { lobbyId: string } | undefined>;
};
export const createLobbyRequestHandler = (
  { createLobby }: CreateLobbyRequestHandlerDependencies,
): CreateLobbyRequestHandler => async (req, res, next) => {
  try {
    const currentUserId = res.locals.currentUser.userId;

    const lobby = await createLobby(currentUserId);

    if (!lobby) {
      res
        .status(HTTPStatusCode.INTERNAL_ERROR)
        .send({ message: 'Failed to create lobby' });

      return;
    }

    const createLobbyResponse: CreateLobbyResponse = {
      lobbyId: lobby.lobbyId,
    };

    res.status(HTTPStatusCode.CREATED).send(createLobbyResponse);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Something went terribly wrong' });
  }

  next();
};
