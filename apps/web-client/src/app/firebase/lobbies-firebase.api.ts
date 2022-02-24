import { LobbyId } from '@machikoro/game-server-contracts';
import {
  push,
  ref,
  set,
  remove,
  child,
  serverTimestamp,
  onDisconnect,
  Database,
} from 'firebase/database';

import { CreateLobby } from '../home';
import { JoinLobby, LeaveLobby } from '../lobby';

export const leaveFirebaseLobby = (firebaseDb: Database): LeaveLobby => async (userId, lobbyId) => {
  const lobbyUserRef = child(ref(firebaseDb), `lobbies/${lobbyId}/users/${userId}`);

  await remove(lobbyUserRef);
};
export const joinFirebaseLobby = (firebaseDb: Database): JoinLobby => async (user, lobbyId) => {
  const lobbyUserRef = child(ref(firebaseDb), `lobbies/${lobbyId}/users/${user.userId}`);

  await set(lobbyUserRef, user);

  /** Make sure user is removed from the lobby in case browser closes */
  void onDisconnect(lobbyUserRef).remove();

  return lobbyId;
};
export const createFirebaseLobby = (firebaseDb: Database): CreateLobby => async (hostId, capacity) => {
  const createdLobbyRef = await push(ref(firebaseDb, 'lobbies'), {
    hostId,
    capacity,
    createdAt: serverTimestamp(),
  });

  // This cast is safe because only root database has a `null` key
  const lobbyId = createdLobbyRef.key! as LobbyId;

  return {
    lobbyId,
    hostId,
    capacity,
  };
};
