import { push } from 'connected-react-router';
import { combineEpics } from 'redux-observable';
import { map, mapTo } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { createGameResolvedEvent } from './game';
import { createLobbyResolvedEvent } from './lobby';
import { authorizeRejectedEvent, registerGuestResolvedEvent } from './login';
import { TypedEpic } from './types';

const redirectToHomePageOnRegisterGuestResolvedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(registerGuestResolvedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(push({ pathname: '/' })),
);

const redirectToLoginPageOnAuthorizeRejectedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(authorizeRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(push({ pathname: '/login' })),
);

const redirectToLobbyPageOnCreateLobbyResolvedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(createLobbyResolvedEvent),
  toPayload(),
  map(({ lobbyId }) => push({ pathname: `/lobbies/${lobbyId}` })),
);

const redirectToGamePageOnCreateGameResolvedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(createGameResolvedEvent),
  toPayload(),
  map(({ gameId }) => push({ pathname: `/games/${gameId}` })),
);

export const navigationEpic = combineEpics(
  redirectToHomePageOnRegisterGuestResolvedEventEpic,
  redirectToLoginPageOnAuthorizeRejectedEventEpic,
  redirectToLobbyPageOnCreateLobbyResolvedEventEpic,
  redirectToGamePageOnCreateGameResolvedEventEpic,
);
