import {
  CreateLobbyResponse,
  Lobby,
  LobbyId,
  ServerError,
  UserId,
} from '@machikoro/game-server-contracts';
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
  createLobby: (payload: { hostId: UserId; capacity: number }) => Promise<Error | Lobby & { lobbyId: LobbyId }>;
};
export const createLobbyRequestHandler = (
  { createLobby }: CreateLobbyRequestHandlerDependencies,
): CreateLobbyRequestHandler => async (req, res, next) => {
  try {
    const currentUserId = res.locals.currentUser.userId;

    const lobbyOrError = await createLobby({
      hostId: currentUserId,
      // TODO: make configurable
      capacity: 4,
    });

    if (lobbyOrError instanceof Error) {
      res
        .status(HTTPStatusCode.INTERNAL_ERROR)
        .send({ message: 'Failed to create lobby' });

      return;
    }

    const createLobbyResponse: CreateLobbyResponse = {
      lobbyId: lobbyOrError.lobbyId,
    };

    res.status(HTTPStatusCode.CREATED).send(createLobbyResponse);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Something went terribly wrong' });
  }

  next();
};
