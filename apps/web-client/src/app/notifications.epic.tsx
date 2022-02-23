import { toast } from 'react-toastify';
import { AnyAction } from 'redux';
import {
  filter,
  ignoreElements,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { JoinLobbyAction, LobbyAction } from './lobby';
import { typedCombineEpics, TypedEpic } from './types/TypedEpic';

const showUserJoinedLobbyNotification: TypedEpic<never> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.userJoinedEvent),
  toPayload(),
  withLatestFrom(state$),
  filter(([{ user }, state]) => state.loginReducer.userId !== user.userId),
  tap(([{ user }]) => {
    // eslint-disable-next-line react/jsx-one-expression-per-line
    toast.info(<p>User <b>{user.username}</b> joined the lobby</p>);
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
    // eslint-disable-next-line react/jsx-one-expression-per-line
    toast.info(<p>User <b>{user.username}</b> left the lobby</p>);
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showJoinLobbyError: TypedEpic<never> = (actions$) => actions$.pipe(
  ofType(JoinLobbyAction.joinLobbyRejectedEvent),
  tap((action) => {
    // eslint-disable-next-line no-console
    console.error(action.payload);
    toast.error('Failed to join the lobby');
  }),
  // `ignoreElements` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ignoreElements(),
);

const showHostChangedNotification: TypedEpic<never> = (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.hostChangedEvent),
  toPayload(),
  withLatestFrom(state$),
  tap(([{ newHostId }, state]) => {
    const newHost = state.lobbyReducer.lobby?.users?.[newHostId];

    if (newHost) {
      // eslint-disable-next-line react/jsx-one-expression-per-line
      toast.info(<p>Host changed! New host is <b>{newHost.username}</b>!</p>);
    } else {
      throw new Error('Host not found');
    }
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
