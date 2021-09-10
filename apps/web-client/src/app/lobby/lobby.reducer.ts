import { LobbyAction, LobbyActionTypes } from './lobby.actions';
import { initialLobbyState, LobbyState } from './lobby.state';

// eslint-disable-next-line @typescript-eslint/default-param-last
export const lobbyReducer = (state: LobbyState = initialLobbyState, action: LobbyAction): LobbyState => {
  switch (action.type) {
    case LobbyActionTypes.SET_LOBBY_PARAMS: {
      return {
        ...state,
        lobbyId: action.payload.lobbyId,
        isJoinLobbyLoading: action.payload.isJoinLobbyLoading,
      };
    }

    default:
      return state;
  }
};
