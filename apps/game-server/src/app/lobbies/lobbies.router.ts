import * as express from 'express';

import { AuthMiddlewareDependencies, authMiddleware } from '../shared/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

import { createLobbyRequestHandler, CreateLobbyRequestHandlerDependencies } from './createLobbyRequest.handler';

export type LobbiesRouterDependencies = CreateLobbyRequestHandlerDependencies & AuthMiddlewareDependencies;
export const initializeLobbiesRouter = (dependencies: LobbiesRouterDependencies): express.Router => {
  const lobbiesRouter = express.Router();

  lobbiesRouter.route('/')
    .post(
      authMiddleware(dependencies),
      asyncHandler(createLobbyRequestHandler(dependencies)),
    );

  return lobbiesRouter;
};
