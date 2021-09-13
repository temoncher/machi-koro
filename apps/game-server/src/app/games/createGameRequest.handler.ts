import {
  CreateGameRequestBody,
  CreateGameResponse,
  Game,
  Lobby,
  ServerError,
  validateLobby,
} from '@machikoro/game-server-contracts';
import { RequestHandler } from 'express';

import { AuthMiddlewareLocals } from '../shared';
import { HTTPStatusCode } from '../types';

type CreateGameRequestHandler = RequestHandler<
Record<string, string>,
CreateGameResponse | ServerError,
CreateGameRequestBody,
Record<string, unknown>,
AuthMiddlewareLocals
>;

export type CreateGameRequestHandlerDependencies = {
  createGame: (currentUserId: string, users: string[]) => Promise<Game>;
  getLobby: (lobbyId: string) => Promise<Lobby | undefined>;
};

export const createGameRequestHandler = (
  { createGame, getLobby }: CreateGameRequestHandlerDependencies,
): CreateGameRequestHandler => async (req, res, next) => {
  try {
    const currentUserId = res.locals.currentUser.userId;
    const { lobbyId } = req.body;

    const lobby = await getLobby(lobbyId);

    const lobbyOrError = validateLobby(lobby);

    if (!lobbyOrError) {
      // TODO: emit error
      return;
    }

    const game = await createGame(currentUserId, lobbyOrError.users);

    const gamesResponse: CreateGameResponse = {
      gameId: game.gameId,
    };

    res.send(gamesResponse);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Something went terribly wrong' });
  }

  next();
};
