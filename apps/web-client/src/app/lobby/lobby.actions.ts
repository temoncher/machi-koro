import { CreateLobbyRequestBody } from '@machikoro/game-server-contracts';
import { push } from 'connected-react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setIsLoading } from '../loading';
import { RootApiType } from '../root.api.type';
import { RootState } from '../root.state';

import { LobbyState } from './lobby.state';

export enum LobbyActionTypes {
  SET_LOBBY_PARAMS = 'APP/SET_LOBBY_PARAMS',
}

type SetLobbyParams = {
  type: LobbyActionTypes.SET_LOBBY_PARAMS;
  payload: LobbyState;
};

export type LobbyAction = SetLobbyParams;

export const setLobbyParams = (lobbyParams: LobbyState): SetLobbyParams => ({
  type: LobbyActionTypes.SET_LOBBY_PARAMS,
  payload: lobbyParams,
});

export const createLobbyThunk = (lobbyData: CreateLobbyRequestBody) => async (
  dispatch: ThunkDispatch<unknown, unknown, Action>,
  getState: () => RootState,
  rootApi: RootApiType.RootApi,
): Promise<void> => {
  dispatch(setIsLoading(true));

  const createLobbyResponse = await rootApi.lobbyApi.sendCreateLobbyRequest(lobbyData);

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
