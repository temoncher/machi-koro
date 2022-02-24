import { GetNamespaceActionType } from '../utils/createActionsNamespace';
import { createEndpoint } from '../utils/createEndpoint';

import { JoinGame, AbandonGame } from './game.api.types';

export const { JoinGameAction, joinGameEpic, joinGameReducer } = createEndpoint<JoinGame>()('JOIN_GAME');
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type JoinGameAction = GetNamespaceActionType<typeof JoinGameAction>;
export const { AbandonGameAction, abandonGameEpic, abandonGameReducer } = createEndpoint<AbandonGame>()('ABANDON_GAME');
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AbandonGameAction = GetNamespaceActionType<typeof AbandonGameAction>;
