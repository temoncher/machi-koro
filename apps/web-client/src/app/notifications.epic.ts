import { toast } from 'react-toastify';
import { AnyAction } from 'redux';
import {
  filter,
  ignoreElements,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { LobbyAction } from './lobby';
import { typedCombineEpics, TypedEpic } from './types/TypedEpic';

const showUserJoinedLobbyNotification: TypedEpic<never> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.userJoinedEvent),
  toPayload(),
  withLatestFrom(state$),
  filter(([{ user }, state]) => state.loginReducer.userId !== user.userId),
  tap(([{ user }]) => {
    toast.info(`User ${user.username} joined the lobby`);
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showUserLeftLobbyNotification: TypedEpic<never> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.userLeftEvent),
  toPayload(),
  withLatestFrom(state$),
  filter(([{ user }, state]) => state.loginReducer.userId !== user.userId),
  tap(([{ user }]) => {
    toast.info(`User ${user.username} left the lobby`);
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showJoinLobbyError: TypedEpic<never> = (actions$) => actions$.pipe(
  ofType(LobbyAction.joinLobbyRejectedEvent),
  toPayload(),
  tap((message) => {
    toast.error(`Failed to join the lobby: ${message}`);
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showHostChangedNotification: TypedEpic<never> = (actions$) => actions$.pipe(
  ofType(LobbyAction.hostChangedEvent),
  toPayload(),
  tap(({ newHost }) => {
    toast.info(`Host changed! New host is ${newHost.username}`);
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

export const notificationsEpic = typedCombineEpics<AnyAction>(
  showJoinLobbyError,
  showUserJoinedLobbyNotification,
  showUserLeftLobbyNotification,
  showHostChangedNotification,
);
