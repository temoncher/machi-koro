import { action, payload } from 'ts-action';

enum LoginActionType {
  AUTHORIZE_COMMAND = '[COMMAND] APP/AUTH/AUTHORIZE',
  AUTHORIZE_RESOLVED_EVENT = '[EVENT] APP/AUTH/AUTHORIZE/RESOLVED',
  AUTHORIZE_REJECTED_EVENT = '[EVENT] APP/AUTH/AUTHORIZE/REJECTED',
  REGISTER_GUEST_COMMAND = '[COMMAND] APP/AUTH/REGISTER_GUEST',
  REGISTER_GUEST_RESOLVED_EVENT = '[EVENT] APP/AUTH/REGISTER_GUEST/RESOLVED',
  REGISTER_GUEST_REJECTED_EVENT = '[EVENT] APP/AUTH/REGISTER_GUEST/REJECTED',
  LOGIN_DOCUMENT = '[DOCUMENT] APP/AUTH/LOGIN',
  LOGOUT_DOCUMENT = '[DOCUMENT] APP/AUTH/LOGOUT',
}

export const authorizeCommand = action(LoginActionType.AUTHORIZE_COMMAND);

export type AuthorizeResolvedPayload = {
  username: string;
  type: 'guest';
  userId: string;
};

export const authorizeResolvedEvent = action(
  LoginActionType.AUTHORIZE_RESOLVED_EVENT,
  payload<AuthorizeResolvedPayload>(),
);
export const authorizeRejectedEvent = action(
  LoginActionType.AUTHORIZE_REJECTED_EVENT,
  payload<string>(),
);

export const registerGuestCommand = action(
  LoginActionType.REGISTER_GUEST_COMMAND,
  payload<string>(),
);

export type RegisterGuestResolvedPayload = {
  username: string;
  type: 'guest';
  userId: string;
  token: string;
};

export const registerGuestResolvedEvent = action(
  LoginActionType.REGISTER_GUEST_RESOLVED_EVENT,
  payload<RegisterGuestResolvedPayload>(),
);
export const registerGuestRejectedEvent = action(
  LoginActionType.REGISTER_GUEST_REJECTED_EVENT,
  payload<string>(),
);

export type LoginPayload = {

};

export const loginCommand = action(LoginActionType.LOGIN_DOCUMENT);
export const logoutCommand = action(LoginActionType.LOGOUT_DOCUMENT);

export type LoginAction =
  | ReturnType<typeof authorizeCommand>
  | ReturnType<typeof authorizeResolvedEvent>
  | ReturnType<typeof authorizeRejectedEvent>
  | ReturnType<typeof registerGuestCommand>
  | ReturnType<typeof registerGuestResolvedEvent>
  | ReturnType<typeof registerGuestRejectedEvent>
  | ReturnType<typeof logoutCommand>;

export const loginActions = {
  authorizeCommand,
  registerGuestCommand,
  logoutCommand,
};
