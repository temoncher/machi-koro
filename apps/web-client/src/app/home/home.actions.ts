import { empty } from 'ts-action';

import { createActionsNamespace, GetNamespaceActionType } from '../utils/createActionsNamespace';

const homeActionTypeToPayloadMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  '[EVENT] APP/HOME/CREATE_LOBBY_BUTTON_CLICKED': empty(),
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const HomeAction = createActionsNamespace(homeActionTypeToPayloadMap);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HomeAction = GetNamespaceActionType<typeof HomeAction>;
