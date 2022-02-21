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

const mapJoinLobbyResolvedEventWsMessageEpic: TypedEpic<typeof LobbyAction.joinLobbyResolvedEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_JOINED_SUCCESSFULLY'),
  map((event) => LobbyAction.joinLobbyResolvedEvent(event.payload)),
);

const mapJoinLobbyRejectedEventWsMessageEpic: TypedEpic<typeof LobbyAction.joinLobbyRejectedEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_JOIN_ERROR'),
  map((event) => LobbyAction.joinLobbyRejectedEvent(event.payload)),
);

const mapHostChangedEventWsMessageEpic: TypedEpic<typeof LobbyAction.hostChangedEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_HOST_CHANGED'),
  map((event) => LobbyAction.hostChangedEvent(event.payload)),
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

const mapCurrentUserLeftLobbyEventWsMessageEpic: TypedEpic<typeof LobbyAction.currentUserLeftLobbyEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_LEFT_SUCCESSFULLY'),
  map((event) => LobbyAction.currentUserLeftLobbyEvent(event.payload)),
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
  joinLobbyEpic,
  mapJoinLobbyResolvedEventWsMessageEpic,
  mapJoinLobbyRejectedEventWsMessageEpic,
  mapHostChangedEventWsMessageEpic,
  setLobbyStateOnLobbyStateUpdatedEpic,
  leaveLobbyEpic,
  mapCurrentUserLeftLobbyEventWsMessageEpic,
  mapGameCreatedEventWsMessageEpic,
  mapUserJoinedEventWsMessageEpic,
  mapUserLeftEventWsMessageEpic,
);
