import { userWithTokenSchema, UserWithToken } from '@machikoro/game-server-contracts';
import { z } from 'zod';

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
