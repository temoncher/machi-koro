import { RouterAction } from 'connected-react-router';
import { action } from 'ts-action';

import { GameAction } from './game';
import { LoadingAction } from './loading';
import { LobbyAction } from './lobby';
import { LoginAction } from './login';
import { WebsocketAction } from './websocket';

enum RootActionType {
  APP_STARTED_EVENT = '[EVENT] APP/STARTED',
}

export namespace RootAction {
  export const appStartedEvent = action(
    RootActionType.APP_STARTED_EVENT,
  );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RootAction =
  | ReturnType<typeof RootAction.appStartedEvent>
  | GameAction
  | LoginAction
  | LoadingAction
  | LobbyAction
  | RouterAction
  | WebsocketAction;
