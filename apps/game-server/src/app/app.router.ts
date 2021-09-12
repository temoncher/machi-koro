import * as express from 'express';

import { AuthRouterDependencies, initializeAuthRouter } from './auth';
import { GamesRouterDependencies, initializeGamesRouter } from './games';
import { initializeLobbiesRouter, LobbiesRouterDependencies } from './lobbies';

export type ApiDependencies = AuthRouterDependencies & LobbiesRouterDependencies & GamesRouterDependencies;

export const initializeApiRouter = (dependencies: ApiDependencies): express.Router => express.Router()
  .use('/auth', initializeAuthRouter(dependencies))
  .use('/lobbies', initializeLobbiesRouter(dependencies))
  .use('/games', initializeGamesRouter(dependencies));
