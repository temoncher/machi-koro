import { z } from 'zod';

import { userSchema } from './user.model';

export const userWithTokenSchema = userSchema.extend({
  token: z.string(),
});
export type UserWithToken = z.infer<typeof userWithTokenSchema>;

export const parseUserWithToken = (user: Record<string, string> | null | undefined): UserWithToken | z.ZodError<UserWithToken> => {
  const parsingResult = userWithTokenSchema.safeParse(user);

  if (!parsingResult.success) {
    return parsingResult.error;
  }

  return parsingResult.data;
};
