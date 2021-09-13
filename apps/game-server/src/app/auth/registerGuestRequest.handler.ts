import {
  RegisterGuestResponse,
  ServerError,
  RegisterGuestRequestBody,
  User,
  UserWithToken,
} from '@machikoro/game-server-contracts';
import { RequestHandler } from 'express';
import { ZodError } from 'zod';

import { HTTPStatusCode } from '../types';

type RegisterGuestRequestHandler = RequestHandler<
Record<string, string>,
RegisterGuestResponse | ServerError,
RegisterGuestRequestBody
>;

export type RegisterGuestRequestHandlerDependencies = {
  getUser: (userId: string) => Promise<User | ZodError>;
  createUser: ({ username, type }: Pick<User, 'username' | 'type'>) => Promise<UserWithToken>;
};
export const registerGuestRequestHandler = (
  { createUser }: RegisterGuestRequestHandlerDependencies,
): RegisterGuestRequestHandler => async (req, res, next) => {
  try {
    const { type, username } = req.body;

    const user = await createUser({ username, type });

    res.status(HTTPStatusCode.CREATED).send(user);
  } catch (error: unknown) {
    res
      .status(HTTPStatusCode.INTERNAL_ERROR)
      .send({ message: 'Internal Server Error' });
  }

  next();
};
