import {
  Game,
  LobbyId,
  PlayerConnectionStatus,
} from '@machikoro/game-server-contracts';
import {
  ref,
  set,
  onDisconnect,
  Database,
} from 'firebase/database';
import { httpsCallable, Functions } from 'firebase/functions';

import { AbandonGame } from '../game';
import { CreateGame } from '../lobby';

export const createFirebaseGame = (
  firebaseFunctions: Functions,
): CreateGame => async (fromLobby) => {
  const { data: createdGame } = await httpsCallable<{ fromLobby: LobbyId }, Game>(firebaseFunctions, 'createGame')({ fromLobby });

  return createdGame;
};

export const joinFirebaseGame = (firebaseDb: Database): AbandonGame => async (user, gameId) => {
  const gamePlayerStatusRef = ref(firebaseDb, `games/${gameId}/playersConnectionStatuses/${user.userId}`);

  await set(gamePlayerStatusRef, PlayerConnectionStatus.CONNECTED);

  void onDisconnect(gamePlayerStatusRef).set(PlayerConnectionStatus.DISCONNECTED);

  return gameId;
};

export const abandonFirebaseGame = (firebaseDb: Database): AbandonGame => async (user, gameId) => {
  const gamePlayerStatusRef = ref(firebaseDb, `games/${gameId}/playersConnectionStatuses/${user.userId}`);

  await set(gamePlayerStatusRef, PlayerConnectionStatus.ABANDONED);

  return gameId;
};
