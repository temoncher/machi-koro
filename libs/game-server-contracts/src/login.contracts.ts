export type RegisterRequestBody = {
  username: string;
  type: 'guest';
};

export type LoginResponse = {
  username: string;
  id: string;
  token?: string;
};
