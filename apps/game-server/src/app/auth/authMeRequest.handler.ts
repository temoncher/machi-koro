import { AuthMeResponse, ServerError } from '@machikoro/game-server-contracts';
import { RequestHandler } from 'express';

import { AuthMiddlewareLocals } from '../shared';
import { HTTPStatusCode } from '../types';

type AuthMeRequestHandler = RequestHandler<
Record<string, string>,
AuthMeResponse | ServerError,
Record<string, unknown>,
Record<string, unknown>,
AuthMiddlewareLocals
>;

export const authMeRequestHandler = (): AuthMeRequestHandler => async (
  req,
  res,
  next,
) => {
  const { userId, username } = res.locals.currentUser;
  const authMeResponse: AuthMeResponse = { username, userId };

  res.status(HTTPStatusCode.OK).send(authMeResponse);
  next();
};
