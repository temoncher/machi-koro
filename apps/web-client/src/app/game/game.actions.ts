import { CreateGameRequestBody } from '@machikoro/game-server-contracts';
import { push } from 'connected-react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { setIsLoading } from '../loading';
import { RootApiType } from '../root.api.type';
import { RootState } from '../root.state';

import { GameState } from './game.state';

export enum GameActionTypes {
  SET_GAME_ID = 'APP/SET_GAME_ID',
}

type SetGameId = {
  type: GameActionTypes.SET_GAME_ID;
  payload: GameState['gameId'];
};

export type GameAction = SetGameId;

export const setGameId = (gameId: GameState['gameId']): SetGameId => ({
  type: GameActionTypes.SET_GAME_ID,
  payload: gameId,
});

export const createGameThunk = (createGameRequestBody: CreateGameRequestBody) => async (
  dispatch: ThunkDispatch<unknown, unknown, Action>,
  getState: () => RootState,
  rootApi: RootApiType.RootApi,
): Promise<void> => {
  dispatch(setIsLoading(true));

  const createGameResponse = await rootApi.gameApi.sendCreateGameRequest(createGameRequestBody);

  dispatch(setGameId(createGameResponse.gameId));
  dispatch(setIsLoading(false));

  dispatch(push(`/games/${createGameResponse.gameId}`));
};

export const gameActions = {
  setGameId,
  createGameThunk,
};
