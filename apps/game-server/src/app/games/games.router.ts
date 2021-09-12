import * as express from 'express';

import { AuthMiddlewareDependencies, authMiddleware } from '../shared';
import { asyncHandler } from '../utils';

import { createGameRequestHandler, CreateGameRequestHandlerDependencies } from './createGameRequest.handler';

export type GamesRouterDependencies = CreateGameRequestHandlerDependencies & AuthMiddlewareDependencies;
export const initializeGamesRouter = (dependencies: GamesRouterDependencies): express.Router => {
  const gamesRouter = express.Router();

  gamesRouter.route('/')
    .post(
      authMiddleware(dependencies),
      asyncHandler(createGameRequestHandler(dependencies)),
    );

  return gamesRouter;
};
