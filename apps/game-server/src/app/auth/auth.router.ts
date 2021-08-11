import * as express from 'express';
import * as asyncHandler from 'express-async-handler';
import { RedisClient } from 'redis';

import { authController } from './auth.controller';
import { authRequestBodySchema } from './authRequestBody.schema';
import { authValidationMiddleware } from './authValidation.middleware';

export const initializeAuthRouter = (redisClientUsers: RedisClient): express.Router => {
  const authRouter = express.Router();

  return authRouter.post(
    '/auth',
    authValidationMiddleware(authRequestBodySchema),
    asyncHandler(authController(redisClientUsers)),
  );
};
