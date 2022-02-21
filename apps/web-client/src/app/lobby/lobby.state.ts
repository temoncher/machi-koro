import { PopulatedLobbyState } from '@machikoro/game-server-contracts';

export type LobbyState = {
  isCreateLobbyLoading: boolean;
  lobby: PopulatedLobbyState | undefined;
};

export const initialLobbyState: LobbyState = {
  isCreateLobbyLoading: false,
  lobby: undefined,
};
