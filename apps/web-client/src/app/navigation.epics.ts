import { GameId, LobbyId } from '@machikoro/game-server-contracts';
import { LocationChangePayload, push } from 'connected-react-router';
import { AnyAction } from 'redux';
import {
  filter,
  first,
  map,
  mapTo,
  Observable,
  switchMap,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { AbandonGameAction, GameAction } from './game';
import { CreateLobbyAction } from './home';
import { JoinLobbyAction, LobbyAction } from './lobby';
import { RegisterGuestAction, LoginAction } from './login';
import { NavigationAction } from './navigation.actions';
import { typedCombineEpics, TypedEpic } from './types/TypedEpic';
import { isDefined } from './utils/isDefined';

const rootPathMatches = <R extends string>(pathToMatch: R) => <T>(source$: Observable<LocationChangePayload<T>>) => source$.pipe(
  filter((payload) => {
    const [, rootPath] = payload.location.pathname.split('/');

    return rootPath === pathToMatch;
  }),
  map((payload) => payload as LocationChangePayload<T> & {
    location: {
      pathname: `/${R}${string}`;
    };
  }),
);

const leftPage = <R extends string>(pathToMatch: R) => (actions$: Observable<AnyAction>) => actions$.pipe(
  ofType(NavigationAction.locationChangeEvent),
  toPayload(),
  rootPathMatches(pathToMatch),
  switchMap((previousPayload) => actions$.pipe(
    ofType(NavigationAction.locationChangeEvent),
    first(),
    toPayload(),
    filter((payload) => {
      const [, rootPath] = payload.location.pathname.split('/');

      return rootPath !== pathToMatch;
    }),
    map((payload) => ({ previousPayload, payload })),
  )),
);

const redirectToHomePageOnRegisterGuestResolvedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(RegisterGuestAction.registerGuestResolvedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(push({ pathname: '/' })),
);

const redirectToHomePageOnJoinLobbyRejectedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(JoinLobbyAction.joinLobbyRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(push({ pathname: '/' })),
);

const redirectToHomePageOnGameEndEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(AbandonGameAction.abandonGameResolvedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(push({ pathname: '/' })),
);

const redirectToLoginPageOnAuthorizeRejectedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(LoginAction.authorizeRejectedEvent),
  // `mapTo` really accepts `any` payload, therefore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  mapTo(push({ pathname: '/login' })),
);

const redirectToLobbyPageOnCreateLobbyResolvedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(CreateLobbyAction.createLobbyResolvedEvent),
  toPayload(),
  map(({ lobbyId }) => push({ pathname: `/lobbies/${lobbyId}` })),
);

const redirectToGamePageOnGameCreatedEventEpic: TypedEpic<typeof push> = (actions$) => actions$.pipe(
  ofType(LobbyAction.gameCreatedEvent),
  toPayload(),
  map((gameId) => push({ pathname: `/games/${gameId}` })),
);

const dispatchEnteredLobbyPageEventOnLobbyPageEnterEpic: TypedEpic<typeof LobbyAction.enteredLobbyPageEvent> = (actions$) => actions$.pipe(
  ofType(NavigationAction.locationChangeEvent),
  toPayload(),
  rootPathMatches('lobbies'),
  map((payload) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [,lobbies, lobbyId] = payload.location.pathname.split('/');

    return lobbyId;
  }),
  // TODO: introduce some kind of error handling in case lobby id is not defined
  filter(isDefined),
  map((lobbyId) => LobbyAction.enteredLobbyPageEvent(lobbyId as LobbyId)),
);

const dispatchLeftLobbyPageEventOnLobbyPageLeave: TypedEpic<typeof LobbyAction.leftLobbyPageEvent> = (actions$) => actions$.pipe(
  leftPage('lobbies'),
  map(({ previousPayload }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [,lobbies, lobbyId] = previousPayload.location.pathname.split('/');

    return lobbyId;
  }),
  // TODO: introduce some kind of error handling in case lobby id is not defined
  filter(isDefined),
  map((lobbyId) => LobbyAction.leftLobbyPageEvent(lobbyId as LobbyId)),
);

const dispatchEnteredGamePageEventOnGamePageEnter: TypedEpic<typeof GameAction.enteredGamePageEvent> = (actions$) => actions$.pipe(
  ofType(NavigationAction.locationChangeEvent),
  toPayload(),
  rootPathMatches('games'),
  map((payload) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [,games, gameId] = payload.location.pathname.split('/');

    return gameId as GameId | undefined;
  }),
  // TODO: introduce some kind of error handling in case lobby id is not defined
  filter(isDefined),
  map(GameAction.enteredGamePageEvent),
);

export const navigationEpic = typedCombineEpics<AnyAction>(
  redirectToHomePageOnRegisterGuestResolvedEventEpic,
  redirectToHomePageOnJoinLobbyRejectedEventEpic,
  redirectToHomePageOnGameEndEpic,
  redirectToLoginPageOnAuthorizeRejectedEventEpic,
  redirectToLobbyPageOnCreateLobbyResolvedEventEpic,
  dispatchEnteredLobbyPageEventOnLobbyPageEnterEpic,
  redirectToGamePageOnGameCreatedEventEpic,
  dispatchEnteredGamePageEventOnGamePageEnter,
  dispatchLeftLobbyPageEventOnLobbyPageLeave,
);
