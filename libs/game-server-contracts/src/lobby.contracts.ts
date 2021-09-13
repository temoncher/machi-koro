export type CreateLobbyResponse = {
  lobbyId: string;
};

export type CreateLobbyRequestBody = {
  hostId: string;
};

export type Lobby = {
  hostId: string;
  users: string[];
};

export const validateLobby = (lobby: Lobby | undefined): Lobby | undefined => {
  if (!lobby || lobby.users.length > 3) {
    return undefined;
  }

  return lobby;
};