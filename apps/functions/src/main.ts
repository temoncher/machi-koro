import { Lobby, LobbyId, User } from '@machikoro/game-server-contracts';
import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const onLobbyUserRemove = functions
  .database
  .ref('/lobbies/{lobbyId}/users/{userId}')
  .onDelete(async (removedUserSnapshot, context) => {
    const lobbyId = context.params.lobbyId as LobbyId;
    const lobbyRef = removedUserSnapshot.ref.parent!.parent!;
    const currentLobbySnapshot = await lobbyRef.get();
    const currentLobby = currentLobbySnapshot.val() as Lobby;

    const removedUser = removedUserSnapshot.val() as User;

    if (currentLobby.users === undefined) {
      functions.logger.info(`Last user (${removedUser.username}:${removedUser.userId}) left lobby(${lobbyId}). Closing the lobby down...`);
      await lobbyRef.remove();
      functions.logger.info(`Lobby(${lobbyId}) is closed`);

      return;
    }

    if (currentLobby.hostId === removedUser.userId) {
      const [firstOfRemainingUsers] = Object.values(currentLobby.users);

      if (firstOfRemainingUsers === undefined) {
        // eslint-disable-next-line max-len
        functions.logger.error(`Host(${removedUser.username}:${removedUser.userId}) left lobby(${lobbyId}). But no users left! The lobby should have been closed by now!`);
      } else {
        const hostIdRef = lobbyRef.child('hostId');

        // eslint-disable-next-line max-len
        functions.logger.info(`Host(${removedUser.username}:${removedUser.userId}) left lobby ${lobbyId}. Migrating host to (${firstOfRemainingUsers.username}:${firstOfRemainingUsers.userId})...`);

        await hostIdRef.set(firstOfRemainingUsers.userId);

        functions.logger.info(`Host for lobby(${lobbyId}) successfully migrated to (${removedUser.username}:${removedUser.userId}).`);
      }
    }
  });
