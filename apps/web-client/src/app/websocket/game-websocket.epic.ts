import { AnyAction } from 'redux';
import { filter, map, withLatestFrom } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { GameAction } from '../game';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { isDefined } from '../utils/isDefined';
import { waitUntilAuthorized } from '../utils/waitUntilAuthorized';

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

const rollDiceEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.rollDiceCommand),
  waitUntilAuthorized(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, { userId }]) => WebsocketAction.sendWsMessageCommand({
    type: 'rollDice',
    payload: userId,
  })),
);

const passEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.passCommand),
  withLatestFrom(state$),
  waitUntilAuthorized(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, { userId }]) => WebsocketAction.sendWsMessageCommand({
    type: 'pass',
    payload: userId,
  })),
);

const startGameEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.startGameCommand),
  withLatestFrom(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, state]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, games, gameId] = state.router.location.pathname.split('/');

    return gameId;
  }),
  // TODO: handle error?
  filter(isDefined),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map((gameId) => WebsocketAction.sendWsMessageCommand({
    type: 'startGame',
    payload: gameId,
  })),
);

const buildEstablishmentEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.buildEstablishmentCommand),
  toPayload(),
  waitUntilAuthorized(state$),
  map(([establishmentToBuild, { userId }]) => WebsocketAction.sendWsMessageCommand({
    type: 'buildEstablishment',
    payload: {
      establishmentToBuild,
      userId,
    },
  })),
);

const buildLandmarkEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand> = (actions$, state$) => actions$.pipe(
  ofType(GameAction.buildLandmarkCommand),
  toPayload(),
  waitUntilAuthorized(state$),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([landmarkToBuild, { userId }]) => WebsocketAction.sendWsMessageCommand({
    type: 'buildLandmark',
    payload: {
      landmarkToBuild,
      userId,
    },
  })),
);

export const gameWebsocketEpic = typedCombineEpics<AnyAction>(
  joinGameEpic,
  setGameContextOnGameStateUpdatedEventEpic,
  rollDiceEpic,
  passEpic,
  startGameEpic,
  buildEstablishmentEpic,
  buildLandmarkEpic,
);
