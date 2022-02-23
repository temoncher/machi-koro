import { AnyAction } from 'redux';
import { map } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { LobbyAction } from '../lobby';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

import { WebsocketAction } from './websocket.actions';
import { ofWsEventType } from './websocket.utils';


const mapHostChangedEventWsMessageEpic: TypedEpic<typeof LobbyAction.hostChangedEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_HOST_CHANGED'),
  map((event) => LobbyAction.hostChangedEvent(event.payload)),
);

const mapGameCreatedEventWsMessageEpic: TypedEpic<typeof LobbyAction.gameCreatedEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_GAME_CREATED'),
  map((event) => LobbyAction.gameCreatedEvent(event.payload)),
);

const mapUserJoinedEventWsMessageEpic: TypedEpic<typeof LobbyAction.userJoinedEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_USER_JOINED'),
  map((event) => LobbyAction.userJoinedEvent(event.payload)),
);

const mapUserLeftEventWsMessageEpic: TypedEpic<typeof LobbyAction.userLeftEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_USER_LEFT'),
  map((event) => LobbyAction.userLeftEvent(event.payload)),
);

export const lobbyWebsocketEpic = typedCombineEpics<AnyAction>(
  mapHostChangedEventWsMessageEpic,
  mapGameCreatedEventWsMessageEpic,
  mapUserJoinedEventWsMessageEpic,
  mapUserLeftEventWsMessageEpic,
);
