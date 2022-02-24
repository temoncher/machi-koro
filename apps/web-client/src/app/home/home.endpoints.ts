import { GetNamespaceActionType } from '../utils/createActionsNamespace';
import { createEndpoint } from '../utils/createEndpoint';

import { CreateLobby } from './home.api.types';

export const { CreateLobbyAction, createLobbyEpic, createLobbyReducer } = createEndpoint<CreateLobby>()('CREATE_LOBBY');
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CreateLobbyAction = GetNamespaceActionType<typeof CreateLobbyAction>;
