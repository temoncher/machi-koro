import { map } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

import { GameAction } from './game.actions';

const joinGameOnGamePageEnteredEventEpic: TypedEpic<typeof GameAction.joinGameCommand> = (actions$) => actions$.pipe(
  ofType(GameAction.enteredGamePageEvent),
  toPayload(),
  map(GameAction.joinGameCommand),
);

export const gameEpic = typedCombineEpics<GameAction>(
  joinGameOnGamePageEnteredEventEpic,
);
