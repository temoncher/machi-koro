import {
  Game,
  Lobby,
  LobbyId,
  User,
} from '@machikoro/game-server-contracts';
import { Database, ref } from 'firebase/database';
import { AnyAction } from 'redux';
import { ListenEvent, object, stateChanges } from 'rxfire/database';
import {
  filter,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { JoinLobbyAction, LobbyAction } from '../lobby';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { isDefined } from '../utils/isDefined';

type SyncLobbyStateDependencies = {
  firebaseDb: Database;
};

const syncLobbyState = (
  deps: SyncLobbyStateDependencies,
): TypedEpic<typeof LobbyAction.setLobbyDocument> => (actions$) => actions$.pipe(
  ofType(JoinLobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => object(ref(deps.firebaseDb, `lobbies/${lobbyId}`)).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.leftLobbyPageEvent))),
    map((lobbyChange) => {
      // TODO: perform validation
      const lobby = lobbyChange.snapshot.val() as Omit<Lobby, 'lobbyId'>;

      return LobbyAction.setLobbyDocument({
        ...lobby,
        lobbyId: lobbyChange.snapshot.key as LobbyId,
      });
    }),
  )),
);

type MapUserAddedChangeToLobbyUserJoinedEventDependencies = {
  firebaseDb: Database;
};

const mapUserAddedChangeToLobbyUserJoinedEvent = (
  deps: MapUserAddedChangeToLobbyUserJoinedEventDependencies,
): TypedEpic<typeof LobbyAction.userJoinedEvent> => (actions$, state$) => actions$.pipe(
  ofType(JoinLobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => stateChanges(
    ref(deps.firebaseDb, `lobbies/${lobbyId}/users`),
    { events: [ListenEvent.added] },
  ).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.leftLobbyPageEvent))),
    withLatestFrom(state$),
    /**
     * Filters out all events that happen before first lobby status change
     * to avoid multiple notifications about users that are already in the lobby
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter(([userChange, state]) => !!state.lobbyReducer.lobby),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([userChange, state]) => {
      // TODO: perform validation
      const user = userChange.snapshot.val() as User;

      return LobbyAction.userJoinedEvent({ lobbyId, user });
    }),
  )),
);

type MapUserRemovedChangeToLobbyUserLeftEventDependencies = {
  firebaseDb: Database;
};

const mapUserRemovedChangeToLobbyUserLeftEvent = (
  deps: MapUserRemovedChangeToLobbyUserLeftEventDependencies,
): TypedEpic<typeof LobbyAction.userLeftEvent> => (actions$) => actions$.pipe(
  ofType(JoinLobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => stateChanges(
    ref(deps.firebaseDb, `lobbies/${lobbyId}/users`),
    { events: [ListenEvent.removed] },
  ).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.leftLobbyPageEvent))),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map((userChange) => {
      // TODO: perform validation
      const user = userChange.snapshot.val() as User;

      return LobbyAction.userLeftEvent({ lobbyId, user });
    }),
  )),
);

type MapHostChangeToLobbyHostChangedEventDependencies = {
  firebaseDb: Database;
};

const mapHostChangeToLobbyHostChangedEvent = (
  deps: MapUserRemovedChangeToLobbyUserLeftEventDependencies,
): TypedEpic<typeof LobbyAction.hostChangedEvent> => (actions$) => actions$.pipe(
  ofType(JoinLobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => stateChanges(
    ref(deps.firebaseDb, `lobbies/${lobbyId}`),
    { events: [ListenEvent.changed] },
  ).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.leftLobbyPageEvent))),
    filter((lobbyChange) => lobbyChange.snapshot.key === 'hostId'),
    map((hostIdChange) => {
      // TODO: perform validation
      const hostId = hostIdChange.snapshot.val() as Lobby['hostId'];

      return LobbyAction.hostChangedEvent({ lobbyId, newHostId: hostId });
    }),
  )),
);

type MapGameIdChangeToGameCreatedEventDependencies = {
  firebaseDb: Database;
};

const mapGameIdChangeToGameCreatedEvent = (
  deps: MapGameIdChangeToGameCreatedEventDependencies,
): TypedEpic<typeof LobbyAction.gameCreatedEvent> => (actions$) => actions$.pipe(
  ofType(JoinLobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => object(ref(deps.firebaseDb, `lobbies/${lobbyId}/gameId`)).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.leftLobbyPageEvent))),
    map((gameIdChange) => gameIdChange.snapshot.val() as Game['gameId']),
    filter(isDefined),
    map(LobbyAction.gameCreatedEvent),
  )),
);

export type FirebaseLobbiesEpicDependencies =
  & SyncLobbyStateDependencies
  & MapUserRemovedChangeToLobbyUserLeftEventDependencies
  & MapUserAddedChangeToLobbyUserJoinedEventDependencies
  & MapHostChangeToLobbyHostChangedEventDependencies
  & MapGameIdChangeToGameCreatedEventDependencies;

export const firebaseLobbiesEpic = (deps: FirebaseLobbiesEpicDependencies) => typedCombineEpics<AnyAction>(
  syncLobbyState(deps),
  mapUserAddedChangeToLobbyUserJoinedEvent(deps),
  mapUserRemovedChangeToLobbyUserLeftEvent(deps),
  mapHostChangeToLobbyHostChangedEvent(deps),
  mapGameIdChangeToGameCreatedEvent(deps),
);
