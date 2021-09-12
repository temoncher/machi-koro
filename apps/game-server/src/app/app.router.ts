import * as express from 'express';

import { AuthRouterDependencies, initializeAuthRouter } from './auth';
import { initializeLobbiesRouter, LobbiesRouterDependencies } from './lobbies';

export type ApiDependencies = AuthRouterDependencies & LobbiesRouterDependencies;

export const initializeApiRouter = (dependencies: ApiDependencies): express.Router => express.Router()
  .use('/auth', initializeAuthRouter(dependencies))
  .use('/lobbies', initializeLobbiesRouter(dependencies));
