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

import {
  createGameCommand,
  createGameResolvedEvent,
  createGameRejectedEvent,
  GameAction,
} from './game.actions';

type CreateGameEpicDependencies = {
  createGame: (requestBody: CreateGameRequestBody) => Promise<CreateGameResponse>;
};

const createGameEpic = (
  deps: CreateGameEpicDependencies,
): TypedEpic<typeof createGameResolvedEvent | typeof createGameRejectedEvent> => (actions$) => actions$.pipe(
  ofType(createGameCommand),
  toPayload(),
  switchMap(({ lobbyId }) => from(deps.createGame({ lobbyId })).pipe(
    map(createGameResolvedEvent),
    catchError((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      return of(createGameRejectedEvent(errorMessage));
    }),
  )),
);

export type GameEpicDependencies = CreateGameEpicDependencies;

export const gameEpic = (deps: GameEpicDependencies) => combineEpics<AnyAction, GameAction, unknown, unknown>(
  createGameEpic(deps),
);
