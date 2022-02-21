import { AnyAction } from 'redux';
import {
  Subject,
  mergeMap,
  ignoreElements,
  tap,
  mapTo,
} from 'rxjs';
import * as SocketIOClient from 'socket.io-client';
import { ofType, toPayload } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { WebsocketConnectionStatus } from '../types/WebsocketConnectionStatus';

import { WebsocketAction } from './websocket.actions';

const fromSocket = (socket: SocketIOClient.Socket) => {
  const ioSubject = new Subject<AnyAction>();

  socket.onAny((type: string, payload: unknown) => {
    const action = {
      type,
      payload,
    };

    // We only receive the events documented in the ServerSentEventsMap
    // ?TODO: perform validation?
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ioSubject.next(WebsocketAction.wsMessageReceivedEvent(action as any));
  });

  socket.once('connect', () => {
    ioSubject.next(WebsocketAction.initializeSocketResolvedEvent());
  });

  socket.on('disconnect', () => {
    ioSubject.complete();
  });

  return ioSubject.asObservable();
};

type InitializeSocketEpicDependencies = {
  socket: SocketIOClient.Socket;
};

const initializeSocketEpic = (deps: InitializeSocketEpicDependencies): TypedEpic => (actions$) => actions$.pipe(
  ofType(WebsocketAction.initializeSocketCommand),
  mergeMap(() => fromSocket(deps.socket)),
);

type SendWsMessageEpicDependencies = {
  socket: SocketIOClient.Socket;
};

const sendWsMessageEpic = (deps: SendWsMessageEpicDependencies): TypedEpic<never> => (actions$) => actions$.pipe(
  ofType(WebsocketAction.sendWsMessageCommand),
  toPayload(),
  tap(({ type, payload }) => {
    if (deps.socket.connected) {
      deps.socket.emit(type, payload);
    } else {
      // TODO: refactor into rxjs retry
      deps.socket.once('connect', () => {
        deps.socket.emit(type, payload);
      });
    }
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

// TODO: probably should be refactored into sync with socket.connected
const setConnectionStatusOnInitializeSocketResolvedEvent: TypedEpic<typeof WebsocketAction.setSocketConnectionStatusDocument> = (
  actions$,
) => actions$.pipe(
  ofType(WebsocketAction.initializeSocketResolvedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(WebsocketAction.setSocketConnectionStatusDocument(WebsocketConnectionStatus.CONNECTED)),
);

export type WebsocketEpicDependencies =
  & InitializeSocketEpicDependencies
  & SendWsMessageEpicDependencies;

export const websocketEpic = (deps: WebsocketEpicDependencies) => typedCombineEpics<WebsocketAction>(
  initializeSocketEpic(deps),
  sendWsMessageEpic(deps),
  setConnectionStatusOnInitializeSocketResolvedEvent,
);
