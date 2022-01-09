import { CreateGameRequestBody, CreateGameResponse } from '@machikoro/game-server-contracts';
import { AnyAction } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  catchError,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { TypedEpic } from '../types';

import { GameAction } from './game.actions';

type CreateGameEpicDependencies = {
  createGame: (requestBody: CreateGameRequestBody) => Promise<CreateGameResponse>;
};

const createGameEpic = (
  deps: CreateGameEpicDependencies,
): TypedEpic<typeof GameAction.createGameResolvedEvent | typeof GameAction.createGameRejectedEvent> => (actions$) => actions$.pipe(
  ofType(GameAction.createGameCommand),
  toPayload(),
  switchMap(({ lobbyId }) => from(deps.createGame({ lobbyId })).pipe(
    map(GameAction.createGameResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(GameAction.createGameRejectedEvent(errorMessage));
    }),
  )),
);

const joinGameOnGamePageEnteredEventEpic: TypedEpic<typeof GameAction.joinGameCommand> = (actions$) => actions$.pipe(
  ofType(GameAction.enteredGamePageEvent),
  toPayload(),
  map(GameAction.joinGameCommand),
);

export type GameEpicDependencies = CreateGameEpicDependencies;

export const gameEpic = (deps: GameEpicDependencies) => combineEpics<AnyAction, GameAction, unknown, unknown>(
  createGameEpic(deps),
  joinGameOnGamePageEnteredEventEpic,
);
