import * as express from 'express';

import { AuthRouterDependencies, initializeAuthRouter } from './auth/auth.router';
import { initializeLobbiesRouter, LobbiesRouterDependencies } from './lobbies/lobbies.router';

export type ApiDependencies = AuthRouterDependencies & LobbiesRouterDependencies;

export const initializeApiRouter = (dependencies: ApiDependencies): express.Router => express.Router()
  .use('/auth', initializeAuthRouter(dependencies))
  .use('/lobbies', initializeLobbiesRouter(dependencies));
