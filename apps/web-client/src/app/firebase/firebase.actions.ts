import { GameContext } from '@machikoro/game-server-contracts';
import { payload } from 'ts-action';

import { createActionsNamespace, GetNamespaceActionType } from '../utils/createActionsNamespace';

const firebaseActionTypeToPayloadMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  '[EVENT] APP/FIREBASE/POST_MESSAGE_RESOLVED': payload<GameContext>(),
  '[EVENT] APP/FIREBASE/POST_MESSAGE_REJECTED': payload<unknown>(),
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const FirebaseAction = createActionsNamespace(firebaseActionTypeToPayloadMap);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FirebaseAction = GetNamespaceActionType<typeof FirebaseAction>;
