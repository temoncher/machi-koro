import * as express from 'express';

import { AuthRouterDependencies, initializeAuthRouter } from './auth';
import { GamesRouterDependencies, initializeGamesRouter } from './games';
import { initializeLobbiesRouter, LobbiesRouterDependencies } from './lobbies';

export type AppRouterDependencies = AuthRouterDependencies & LobbiesRouterDependencies & GamesRouterDependencies;

export const initializeAppRouter = (dependencies: AppRouterDependencies): express.Router => express.Router()
  .use('/auth', initializeAuthRouter(dependencies))
  .use('/lobbies', initializeLobbiesRouter(dependencies))
  .use('/games', initializeGamesRouter(dependencies));
