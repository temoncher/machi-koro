import { Lobby } from '@machikoro/game-server-contracts';

export type LobbyState = {
  isCreateLobbyLoading: boolean;
  lobby: Lobby | undefined;
};

export const initialLobbyState: LobbyState = {
  isCreateLobbyLoading: false,
  lobby: undefined,
};
