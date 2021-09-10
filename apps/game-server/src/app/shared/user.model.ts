import { userSchema } from '@machikoro/game-server-contracts';
import { z } from 'zod';

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

export const userWithTokenWithoutIdSchema = userWithTokenSchema.omit({ userId: true });
export type UserWithTokenWithoutId = z.infer<typeof userWithTokenWithoutIdSchema>;

export const parseUserWithTokenWithoutId = (
  user: Record<string, string> | null | undefined,
): UserWithTokenWithoutId | z.ZodError<UserWithToken> => {
  const parsingResult = userWithTokenWithoutIdSchema.safeParse(user);

  if (!parsingResult.success) {
    return parsingResult.error;
  }

  return parsingResult.data;
};
