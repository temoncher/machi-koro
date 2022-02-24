import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type UserId = string & { readonly USER_ID: unique symbol };

export const FIRST_CHAR_USERNAME_REGEXP = /^[A-Za-z]/;
export const USERNAME_REGEXP = /^[A-Za-z-_\s]+$/;
const MIN_LENGTH_USERNAME = 1;
const MAX_LENGTH_USERNAME = 30;

const usernameSchema = z
  .string()
  .min(MIN_LENGTH_USERNAME, {
    message: `'username' must be between ${String(
      MIN_LENGTH_USERNAME,
    )} and ${String(MAX_LENGTH_USERNAME)} characters`,
  })
  .max(MAX_LENGTH_USERNAME, {
    message: `'username' must be between ${String(
      MIN_LENGTH_USERNAME,
    )} and ${String(MAX_LENGTH_USERNAME)} characters`,
  })
  .regex(FIRST_CHAR_USERNAME_REGEXP, {
    message: "'username' must start with A-Z, a-z character",
  })
  .regex(USERNAME_REGEXP, {
    message: "'username' must contain only A-Z, a-z, -, _ characters",
  });

const userIdShema = z.string();

export const userSchema = z.object({
  username: usernameSchema,
  userId: userIdShema,
});

export type User = z.infer<typeof userSchema> & { userId: UserId };
