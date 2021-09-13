import { z } from 'zod';

import { UserWithToken } from './user-with-token.model';
import { userSchema, User } from './user.model';

export type AuthMeResponse = User;

export type RegisterGuestResponse = UserWithToken;

export const registerGuestRequestBodySchema = userSchema.omit({ userId: true });

export type RegisterGuestRequestBody = z.infer<typeof registerGuestRequestBodySchema>;
