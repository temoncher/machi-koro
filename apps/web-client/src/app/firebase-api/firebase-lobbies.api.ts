import { Lobby } from '@machikoro/game-server-contracts';
import {
  push,
  ref,
  set,
  get,
  child,
  serverTimestamp,
  Database,
} from 'firebase/database';
import { object } from 'rxfire/database';
import { map } from 'rxjs';

import {
  CreateLobby,
  GetLobby,
  GetLobbyState$,
  JoinLobby,
} from '../lobby';

export const joinFirebaseLobby = (firebaseDb: Database): JoinLobby => async (user, lobbyId) => {
  const lobbyUserRef = child(ref(firebaseDb), `lobbies/${lobbyId}/users/${user.userId}`);

  await set(lobbyUserRef, user);
};

export const getFirebaseLobbyState$ = (firebaseDb: Database): GetLobbyState$ => (lobbyId) => {
  const lobbyRef = child(ref(firebaseDb), `lobbies/${lobbyId}`);

  return object(lobbyRef).pipe(
    map((lobbyChange) => {
      if (!lobbyChange.snapshot.exists()) return undefined;

      return lobbyChange.snapshot.val() as Lobby;
    }),
  );
};

export const getFirebaseLobby = (firebaseDb: Database): GetLobby => async (lobbyId) => {
  const lobbyRef = child(ref(firebaseDb), `lobbies/${lobbyId}`);
  const lobbySnapshot = await get(lobbyRef);

  if (!lobbySnapshot.exists()) return undefined;

  const lobby = lobbySnapshot.val() as Lobby & { createdAt: unknown };

  return lobby;
};

export const createFirebaseLobby = (firebaseDb: Database): CreateLobby => async (hostId, capacity) => {
  const createdLobbyRef = await push(ref(firebaseDb, 'lobbies'), {
    hostId,
    capacity,
    users: {},
    createdAt: serverTimestamp(),
  });

  return {
    // This cast is safe because only root database has a `null` key
    lobbyId: createdLobbyRef.key!,
    hostId,
    capacity,
    users: {},
  };
};
