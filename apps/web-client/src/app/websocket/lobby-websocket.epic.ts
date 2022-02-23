import { AnyAction } from 'redux';
import { map } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { LobbyAction } from '../lobby';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

import { WebsocketAction } from './websocket.actions';
import { ofWsEventType } from './websocket.utils';

const mapGameCreatedEventWsMessageEpic: TypedEpic<typeof LobbyAction.gameCreatedEvent> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.wsMessageReceivedEvent),
  toPayload(),
  ofWsEventType('LOBBY_GAME_CREATED'),
  map((event) => LobbyAction.gameCreatedEvent(event.payload)),
);

export const lobbyWebsocketEpic = typedCombineEpics<AnyAction>(
  mapGameCreatedEventWsMessageEpic,
);
