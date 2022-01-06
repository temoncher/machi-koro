import { on, reducer } from 'ts-action';

import { setIsCreateLobbyLoadingDocument } from './lobby.actions';
import { initialLobbyState } from './lobby.state';

export const lobbyReducer = reducer(
  initialLobbyState,
  on(setIsCreateLobbyLoadingDocument, (state, action) => ({
    ...state,
    isCreateLobbyLoading: action.payload,
  })),
);
