export type LobbyState = {
  lobbyId: string;
  isJoinLobbyLoading: boolean;
};

export const initialLobbyState: LobbyState = {
  lobbyId: '',
  isJoinLobbyLoading: false,
};
