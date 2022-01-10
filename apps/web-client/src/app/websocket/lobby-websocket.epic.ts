import { AnyAction } from 'redux';
import { map } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { LobbyAction } from '../lobby';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

import { WebsocketAction } from './websocket.actions';
import { ofWsEventType } from './websocket.utils';

const joinLobbyEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand> = (actions$) => actions$.pipe(
  ofType(LobbyAction.joinLobbyCommand),
  toPayload(),
  map((lobbyId) => WebsocketAction.sendWsMessageCommand({
    type: 'joinLobby',
    payload: lobbyId,
  })),
);

const setLobbyStateOnLobbyStateUpdatedEpic: TypedEpic<typeof LobbyAction.setLobbyDocument> = (actions$) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_STATE_UPDATED'),
  map((event) => LobbyAction.setLobbyDocument(event.payload)),
);

const leaveLobbyEpic: TypedEpic<typeof WebsocketAction.sendWsMessageCommand> = (actions$) => actions$.pipe(
  ofType(LobbyAction.leaveLobbyCommand),
  toPayload(),
  map((lobbyId) => WebsocketAction.sendWsMessageCommand({
    type: 'leaveLobby',
    payload: lobbyId,
  })),
);

const dispatchCurrentUserLeftLobbyEventOnLobbyLeftSuccessfullyEventEpic: TypedEpic<typeof LobbyAction.currentUserLeftLobbyEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_LEFT_SUCCESSFULLY'),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  map((event) => LobbyAction.currentUserLeftLobbyEvent(event.payload)),
);

const dispatchGameCreatedEventOnGameCreatedWsMessageEpic: TypedEpic<typeof LobbyAction.gameCreatedEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_GAME_CREATED'),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  map((event) => LobbyAction.gameCreatedEvent(event.payload)),
);

export const lobbyWebsocketEpic = typedCombineEpics<AnyAction>(
  joinLobbyEpic,
  setLobbyStateOnLobbyStateUpdatedEpic,
  leaveLobbyEpic,
  dispatchCurrentUserLeftLobbyEventOnLobbyLeftSuccessfullyEventEpic,
  dispatchGameCreatedEventOnGameCreatedWsMessageEpic,
);
