import { on, reducer } from 'ts-action';

import { LobbyAction } from './lobby.actions';
import { initialLobbyState } from './lobby.state';

export const lobbyReducer = reducer(
  initialLobbyState,
  on(LobbyAction.setLobbyDocument, (state, action) => ({
    ...state,
    lobby: action.payload,
  })),
);
