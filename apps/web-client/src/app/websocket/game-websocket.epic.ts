import { AnyAction } from 'redux';
import { combineEpics } from 'redux-observable';
import { filter, map, withLatestFrom } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { GameAction } from '../game';
import { RootState } from '../root.state';
import { TypedEpic } from '../types';
import { RxjsUtils } from '../utils';

import { WebsocketAction } from './websocket.actions';
import { ofWsEventType } from './websocket.utils';

const joinGameEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand> = (actions$) => actions$.pipe(
  ofType(GameAction.joinGameCommand),
  toPayload(),
  map((gameId) => WebsocketAction.sendWsMessageCommand({
    type: 'joinGame',
    payload: gameId,
  })),
);

const setGameContextOnGameStateUpdatedEventEpic: TypedEpic<typeof GameAction.setGameDocument> = (actions$) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('GAME_STATE_UPDATED'),
  map((event) => GameAction.setGameDocument(event.payload)),
);

const rollDiceEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand, RootState> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.rollDiceCommand),
  withLatestFrom(state$),
  // TODO: add error handling (if userId is undefined)?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, state]) => state.loginReducer.userId as string),
  map((userId) => WebsocketAction.sendWsMessageCommand({
    type: 'rollDice',
    payload: userId,
  })),
);

const passEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand, RootState> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.passCommand),
  withLatestFrom(state$),
  // TODO: add error handling (if userId is undefined)?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, state]) => state.loginReducer.userId as string),
  map((userId) => WebsocketAction.sendWsMessageCommand({
    type: 'pass',
    payload: userId,
  })),
);

const startGameEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand, RootState> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.startGameCommand),
  withLatestFrom(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, state]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, games, gameId] = state.router.location.pathname.split('/');

    return gameId;
  }),
  // TODO: handle error?
  filter(RxjsUtils.isDefined),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map((gameId) => WebsocketAction.sendWsMessageCommand({
    type: 'startGame',
    payload: gameId,
  })),
);

const buildEstablishmentEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand, RootState> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.buildEstablishmentCommand),
  toPayload(),
  withLatestFrom(state$),
  // TODO: add error handling (if userId is undefined)?
  map(([establishmentToBuild, state]) => [establishmentToBuild, state.loginReducer.userId] as [string, string]),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([establishmentToBuild, userId]) => WebsocketAction.sendWsMessageCommand({
    type: 'buildEstablishment',
    payload: {
      establishmentToBuild,
      userId,
    },
  })),
);

const buildLandmarkEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand, RootState> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.buildLandmarkCommand),
  toPayload(),
  withLatestFrom(state$),
  // TODO: add error handling (if userId is undefined)?
  map(([landmarkToBuild, state]) => [landmarkToBuild, state.loginReducer.userId] as [string, string]),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([landmarkToBuild, userId]) => WebsocketAction.sendWsMessageCommand({
    type: 'buildLandmark',
    payload: {
      landmarkToBuild,
      userId,
    },
  })),
);

export const gameWebsocketEpic = combineEpics<AnyAction, AnyAction, RootState, unknown>(
  joinGameEpic,
  setGameContextOnGameStateUpdatedEventEpic,
  rollDiceEpic,
  passEpic,
  startGameEpic,
  buildEstablishmentEpic,
  buildLandmarkEpic,
);
