import { on, reducer } from 'ts-action';

import { LobbyAction } from './lobby.actions';
import { initialLobbyState } from './lobby.state';

export const lobbyReducer = reducer(
  initialLobbyState,
  // TODO?: use redux toolkit for such queries
  on(LobbyAction.setIsCreateLobbyLoadingDocument, (state, action) => ({
    ...state,
    isCreateLobbyLoading: action.payload,
  })),
  on(LobbyAction.setLobbyDocument, (state, action) => ({
    ...state,
    lobby: action.payload,
  })),
);
