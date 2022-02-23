import {
  GameId,
  Lobby,
  LobbyId,
  User,
  UserId,
} from '@machikoro/game-server-contracts';
import { empty, payload } from 'ts-action';

import { createActionsNamespace, GetNamespaceActionType } from '../utils/createActionsNamespace';

const lobbyActionTypeToPayloadMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  '[EVENT] APP/LOBBY/ENTERED_LOBBY_PAGE': payload<LobbyId>(),
  '[EVENT] APP/LOBBY/LEFT_LOBBY_PAGE': payload<LobbyId>(),
  '[EVENT] APP/LOBBY/LEAVE_LOBBY_BUTTON_CLICKED': empty(),
  '[EVENT] APP/LOBBY/HOST_CHANGED': payload<{ newHostId: UserId; lobbyId: LobbyId }>(),
  '[DOCUMENT] APP/LOBBY/SET_LOBBY': payload<Lobby | undefined>(),
  '[EVENT] APP/LOBBY/CURRENT_USER_LEFT_LOBBY': payload<LobbyId>(),
  '[EVENT] APP/LOBBY/GAME_CREATED': payload<GameId>(),
  '[EVENT] APP/LOBBY/USER_JOINED': payload<{ user: User; lobbyId: LobbyId }>(),
  '[EVENT] APP/LOBBY/USER_LEFT': payload<{ user: User; lobbyId: LobbyId }>(),
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const LobbyAction = createActionsNamespace(lobbyActionTypeToPayloadMap);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LobbyAction = GetNamespaceActionType<typeof LobbyAction>;
