import {
  FIRST_CHAR_USERNAME_REGEXP,
  USERNAME_REGEXP,
  MIN_LENGTH_USERNAME,
  MAX_LENGTH_USERNAME,
} from '@machikoro/game-server-contracts/username-validation';
import { z } from 'zod';

const authTypesGuest = 'guest';

export const authRequestBodySchema = z.object({
  body: z.object({
    nickname: z
      .string()
      .min(MIN_LENGTH_USERNAME, {
        message: `'nickname' must be between ${String(
          MIN_LENGTH_USERNAME,
        )} and ${String(MAX_LENGTH_USERNAME)} characters`,
      })
      .max(MAX_LENGTH_USERNAME, {
        message: `'nickname' must be between ${String(
          MIN_LENGTH_USERNAME,
        )} and ${String(MAX_LENGTH_USERNAME)} characters`,
      })
      .regex(FIRST_CHAR_USERNAME_REGEXP, {
        message: "'nickname' must start with A-Z, a-z character",
      })
      .regex(USERNAME_REGEXP, {
        message: "'nickname' must contain only A-Z, a-z, -, _ characters",
      }),
    type: z.enum([authTypesGuest]),
  }),
});

export type AuthRequestBodySchema = typeof authRequestBodySchema;
export type AuthRequestBody = z.infer<typeof authRequestBodySchema>;
