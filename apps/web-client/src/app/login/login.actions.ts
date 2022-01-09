import { AuthMeResponse, RegisterGuestResponse } from '@machikoro/game-server-contracts';
import { action, payload } from 'ts-action';

enum LoginActionType {
  AUTHORIZE_COMMAND = '[COMMAND] APP/AUTH/AUTHORIZE',
  AUTHORIZE_RESOLVED_EVENT = '[EVENT] APP/AUTH/AUTHORIZE/RESOLVED',
  AUTHORIZE_REJECTED_EVENT = '[EVENT] APP/AUTH/AUTHORIZE/REJECTED',
  REGISTER_GUEST_COMMAND = '[COMMAND] APP/AUTH/REGISTER_GUEST',
  REGISTER_GUEST_RESOLVED_EVENT = '[EVENT] APP/AUTH/REGISTER_GUEST/RESOLVED',
  REGISTER_GUEST_REJECTED_EVENT = '[EVENT] APP/AUTH/REGISTER_GUEST/REJECTED',
}

export namespace LoginAction {
  export const authorizeCommand = action(LoginActionType.AUTHORIZE_COMMAND);

  export const authorizeResolvedEvent = action(
    LoginActionType.AUTHORIZE_RESOLVED_EVENT,
    payload<AuthMeResponse>(),
  );
  export const authorizeRejectedEvent = action(
    LoginActionType.AUTHORIZE_REJECTED_EVENT,
    payload<string>(),
  );

  export const registerGuestCommand = action(
    LoginActionType.REGISTER_GUEST_COMMAND,
    payload<string>(),
  );

  export const registerGuestResolvedEvent = action(
    LoginActionType.REGISTER_GUEST_RESOLVED_EVENT,
    payload<RegisterGuestResponse>(),
  );
  export const registerGuestRejectedEvent = action(
    LoginActionType.REGISTER_GUEST_REJECTED_EVENT,
    payload<string>(),
  );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LoginAction =
  | ReturnType<typeof LoginAction.authorizeCommand>
  | ReturnType<typeof LoginAction.authorizeResolvedEvent>
  | ReturnType<typeof LoginAction.authorizeRejectedEvent>
  | ReturnType<typeof LoginAction.registerGuestCommand>
  | ReturnType<typeof LoginAction.registerGuestResolvedEvent>
  | ReturnType<typeof LoginAction.registerGuestRejectedEvent>;

export const loginActions = {
  authorizeCommand: LoginAction.authorizeCommand,
  registerGuestCommand: LoginAction.registerGuestCommand,
};
