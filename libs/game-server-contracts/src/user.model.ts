// eslint-disable-next-line @typescript-eslint/naming-convention
export type UserId = string & { readonly USER_ID: unique symbol };

export const FIRST_CHAR_USERNAME_REGEXP = /^[A-Za-z]/;
export const USERNAME_REGEXP = /^[A-Za-z-_\s]+$/;

export type User = {
  userId: UserId;
  username: string;
};
