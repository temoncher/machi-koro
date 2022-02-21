import {
  CreateGameRequestBody,
  CreateGameResponse,
  Game,
  GameId,
  Lobby,
  LobbyId,
  ServerError,
  UserId,
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
  createGame: (currentUserId: UserId, users: UserId[]) => Promise<Game>;
  getLobby: (lobbyId: LobbyId) => Promise<Error | Lobby>;
  dispatchGameCreatedEvent: (payload: { lobbyId: LobbyId; gameId: GameId }) => void;
};

export const createGameRequestHandler = (
  deps: CreateGameRequestHandlerDependencies,
): CreateGameRequestHandler => async (req, res, next) => {
  try {
    const currentUserId = res.locals.currentUser.userId;
    const { lobbyId } = req.body;

    const lobbyOrError = await deps.getLobby(lobbyId);

    if (lobbyOrError instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(lobbyOrError.message);

      return;
    }

    const game = await deps.createGame(currentUserId, lobbyOrError.users);

    const gamesResponse: CreateGameResponse = {
      gameId: game.gameId,
    };

    // TODO: make this call reactive (middleware?)
    deps.dispatchGameCreatedEvent({ lobbyId, gameId: game.gameId });
    res.send(gamesResponse);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Something went terribly wrong' });
  }

  next();
};
