import { Lobby } from '@machikoro/game-server-contracts';

export type LobbyState = {
  lobby: Lobby | undefined;
};

export const initialLobbyState: LobbyState = {
  lobby: undefined,
};
