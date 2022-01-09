import { z } from 'zod';

export type UserId = string;

export const FIRST_CHAR_USERNAME_REGEXP = /^[A-Za-z]/;
export const USERNAME_REGEXP = /^[A-Za-z-_\s]+$/;
const MIN_LENGTH_USERNAME = 1;
const MAX_LENGTH_USERNAME = 30;

export const usernameSchema = z
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

export type Username = z.infer<typeof usernameSchema>;

export const userTypeSchema = z.enum(['guest']);
export type UserType = z.infer<typeof userTypeSchema>;

const userIdShema = z.string();

export const userSchema = z.object({
  username: usernameSchema,
  type: userTypeSchema,
  userId: userIdShema,
});

export type User = z.infer<typeof userSchema>;
