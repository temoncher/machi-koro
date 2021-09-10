import { registerGuestRequestBodySchema } from '@machikoro/game-server-contracts';
import * as express from 'express';

import { authMiddleware } from '../shared/auth.middleware';
import { bodyParserMiddleware } from '../shared/body-parser.middleware';
import { asyncHandler } from '../utils/asyncHandler';

import { authMeRequestHandler } from './authMeRequest.handler';
import { registerGuestRequestHandler, RegisterGuestRequestHandlerDependencies } from './registerGuestRequest.handler';

export type AuthRouterDependencies = RegisterGuestRequestHandlerDependencies;
export const initializeAuthRouter = (dependencies: AuthRouterDependencies): express.Router => {
  const authRouter = express.Router();

  authRouter
    .post(
      '/register',
      bodyParserMiddleware(registerGuestRequestBodySchema),
      asyncHandler(registerGuestRequestHandler(dependencies)),
    )
    .get(
      '/me',
      authMiddleware(dependencies),
      asyncHandler(authMeRequestHandler()),
    );

  return authRouter;
};
