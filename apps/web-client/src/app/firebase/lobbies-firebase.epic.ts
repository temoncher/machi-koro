import { Lobby, User } from '@machikoro/game-server-contracts';
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

import { LobbyAction } from '../lobby';
import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';

type SyncLobbyStateDependencies = {
  firebaseDb: Database;
};

const syncLobbyState = (
  deps: SyncLobbyStateDependencies,
): TypedEpic<typeof LobbyAction.setLobbyDocument> => (actions$) => actions$.pipe(
  ofType(LobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => object(ref(deps.firebaseDb, `lobbies/${lobbyId}`)).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.currentUserLeftLobbyEvent))),
    map((lobbyChange) => {
      // TODO: perform validation
      const lobby = lobbyChange.snapshot.val() as Lobby;

      return LobbyAction.setLobbyDocument(lobby);
    }),
  )),
);

type MapUserAddedChangeToLobbyUserJoinedEventDependencies = {
  firebaseDb: Database;
};

const mapUserAddedChangeToLobbyUserJoinedEvent = (
  deps: MapUserAddedChangeToLobbyUserJoinedEventDependencies,
): TypedEpic<typeof LobbyAction.userJoinedEvent> => (actions$, state$) => actions$.pipe(
  ofType(LobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => stateChanges(
    ref(deps.firebaseDb, `lobbies/${lobbyId}/users`),
    { events: [ListenEvent.added] },
  ).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.currentUserLeftLobbyEvent))),
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
  ofType(LobbyAction.joinLobbyResolvedEvent),
  toPayload(),
  switchMap((lobbyId) => stateChanges(
    ref(deps.firebaseDb, `lobbies/${lobbyId}/users`),
    { events: [ListenEvent.removed] },
  ).pipe(
    // TODO: check if this takeUntil really unsubscribes from lobby state object
    takeUntil(actions$.pipe(ofType(LobbyAction.currentUserLeftLobbyEvent))),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map((userChange) => {
      // TODO: perform validation
      const user = userChange.snapshot.val() as User;

      return LobbyAction.userLeftEvent({ lobbyId, user });
    }),
  )),
);

export type FirebaseLobbiesEpicDependencies =
  & SyncLobbyStateDependencies
  & MapUserRemovedChangeToLobbyUserLeftEventDependencies
  & MapUserAddedChangeToLobbyUserJoinedEventDependencies;

export const firebaseLobbiesEpic = (deps: FirebaseLobbiesEpicDependencies) => typedCombineEpics<AnyAction>(
  syncLobbyState(deps),
  mapUserAddedChangeToLobbyUserJoinedEvent(deps),
  mapUserRemovedChangeToLobbyUserLeftEvent(deps),
);
