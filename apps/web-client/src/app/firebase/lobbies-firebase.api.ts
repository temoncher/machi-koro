import { Lobby, LobbyId } from '@machikoro/game-server-contracts';
import {
  push,
  ref,
  set,
  remove,
  get,
  child,
  serverTimestamp,
  onDisconnect,
  Database,
} from 'firebase/database';
import { object } from 'rxfire/database';
import { map } from 'rxjs';

import {
  CreateLobby,
  GetLobby,
  JoinLobby,
  LeaveLobby,
} from '../lobby';

export const leaveFirebaseLobby = (firebaseDb: Database): LeaveLobby => async (userId, lobbyId) => {
  const lobbyUserRef = child(ref(firebaseDb), `lobbies/${lobbyId}/users/${userId}`);

  await remove(lobbyUserRef);
};
export const joinFirebaseLobby = (firebaseDb: Database): JoinLobby => async (user, lobbyId) => {
  const lobbyUserRef = child(ref(firebaseDb), `lobbies/${lobbyId}/users/${user.userId}`);

  await set(lobbyUserRef, user);

  /** Make sure user is removed from the lobby in case browser closes */
  void onDisconnect(lobbyUserRef).remove();
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

  const lobbyId = createdLobbyRef.key! as LobbyId;

  return {
    // This cast is safe because only root database has a `null` key
    lobbyId,
    hostId,
    capacity,
    users: {},
  };
};
