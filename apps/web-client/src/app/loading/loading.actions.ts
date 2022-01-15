import { payload } from 'ts-action';

import { createActionsNamespace, GetNamespaceActionType } from '../utils/createActionsNamespace';

const loadingActionTypeToPayloadMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  '[DOCUMENT] APP/LOADING/SET_IS_LOADING': payload<boolean>(),
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const LoadingAction = createActionsNamespace(loadingActionTypeToPayloadMap);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LoadingAction = GetNamespaceActionType<typeof LoadingAction>;
