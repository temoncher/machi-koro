import { GameId } from '@machikoro/game-server-contracts';
import { push, ref, Database } from 'firebase/database';

import { CreateGame } from '../lobby';

export const createFirebaseGame = (firebaseDb: Database): CreateGame => async (partialGame) => {
  const createdGameRef = await push(ref(firebaseDb, 'games'), partialGame);

  // This cast is safe because only root database has a `null` key
  const gameId = createdGameRef.key! as GameId;

  return {
    ...partialGame,
    gameId,
  };
};
