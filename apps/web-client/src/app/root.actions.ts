import { RouterAction } from 'connected-react-router';
import { empty } from 'ts-action';

import { GameAction } from './game';
import { LoadingAction } from './loading';
import { LobbyAction } from './lobby';
import { LoginAction } from './login';
import { createActionsNamespace, GetNamespaceActionType } from './utils/createActionsNamespace';
import { WebsocketAction } from './websocket';

const rootActionTypeToPayloadMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  '[EVENT] APP/APP_STARTED': empty(),
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const RootAction = createActionsNamespace(rootActionTypeToPayloadMap);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RootAction =
  | GetNamespaceActionType<typeof RootAction>
  | GameAction
  | LoginAction
  | LoadingAction
  | LobbyAction
  | RouterAction
  | WebsocketAction;
