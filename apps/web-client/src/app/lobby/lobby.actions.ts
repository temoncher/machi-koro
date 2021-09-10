import { push } from 'connected-react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setIsLoading } from '../loading/loading.actions';
import { RootApi } from '../root.api';
import { RootState } from '../root.state';

import { LobbyApi } from './lobby.api';
import { LobbyState } from './lobby.state';

export enum LobbyActionTypes {
  SET_LOBBY_PARAMS = 'APP/SET_LOBBY_PARAMS',
}

type SetLobbyParams = {
  type: LobbyActionTypes.SET_LOBBY_PARAMS;
  payload: LobbyState;
};

export type LobbyAction = SetLobbyParams;

export const setLobbyParams = (lobbyParams: LobbyState): LobbyAction => ({
  type: LobbyActionTypes.SET_LOBBY_PARAMS,
  payload: lobbyParams,
});

export const createLobbyThunk = (lobbyData: LobbyApi.CreateLobbyRequestBody) => async (
  dispatch: ThunkDispatch<unknown, unknown, Action>,
  getState: () => RootState,
  rootApi: RootApi.RootApi,
): Promise<void> => {
  dispatch(setIsLoading(true));

  const mockUserData = {
    lobbyId: '',
  };

  const createLobbyResponse = await rootApi.lobbyApi.sendCreateLobbyRequest(lobbyData)
    .catch(() => mockUserData);

  const lobbyParams: LobbyState = {
    lobbyId: createLobbyResponse.lobbyId,
    isJoinLobbyLoading: true,
  };

  dispatch(setLobbyParams(lobbyParams));
  dispatch(setIsLoading(false));

  dispatch(push(`/lobbies/${lobbyParams.lobbyId}`));
};

export const lobbyActions = {
  setLobbyParams,
  createLobbyThunk,
};
