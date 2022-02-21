import { registerGuestRequestBodySchema } from '@machikoro/game-server-contracts';
import * as express from 'express';

import { authMiddleware, AuthMiddlewareDependencies, bodyParserMiddleware } from '../shared';
import { asyncHandler } from '../utils';

import { authMeRequestHandler } from './authMeRequest.handler';
import { registerGuestRequestHandler, RegisterGuestRequestHandlerDependencies } from './registerGuestRequest.handler';

export type AuthRouterDependencies = AuthMiddlewareDependencies & RegisterGuestRequestHandlerDependencies;
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
