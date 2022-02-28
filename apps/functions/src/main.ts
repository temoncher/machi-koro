import {
  Game,
  GameId,
  GameMachineMessage,
  Lobby,
  LobbyId,
  PlayerConnectionStatus,
  User,
  UserId,
} from '@machikoro/game-server-contracts';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { interpret } from 'xstate';

import { createGameMachine } from './game-machine';

const app = admin.initializeApp();
const database = admin.database(app);

const setupGameMachine = (game: Game) => {
  const gameMachine = createGameMachine(Object.keys(game.players) as UserId[]);
  const gameLog = game.log ?? [];

  const interpretedGameMachine = interpret(gameMachine).start();

  gameLog.forEach((message) => {
    interpretedGameMachine.send(message);
  });

  return interpretedGameMachine;
};

export const postGameMessage = functions
  .region('europe-west1')
  .https
  .onCall(async (requestData, context) => {
    const userId = context.auth?.uid as UserId;
    const gameData = requestData as { gameId: GameId; message: Omit<GameMachineMessage, 'userId'> };
    const gameRef = database.ref(`games/${gameData.gameId}`);

    const currentGameSnapshot = await gameRef.get();
    const currentGame = currentGameSnapshot.val() as Game;

    const gameMachine = setupGameMachine(currentGame);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const message = {
      ...gameData.message,
      userId,
      // TODO: figure out a way to avoid this cast
    } as GameMachineMessage;

    const newState = gameMachine.send(message);

    if (newState.changed) {
      const currentGameLog = currentGame.log ?? [];

      const { winnerId, ...newContext } = newState.context;

      await gameRef.update({
        log: [...currentGameLog, message],
        context: {
          ...newContext,
          winnerId: winnerId ?? null,
        },
      });

      functions.logger.info(`Successfully posted message(${gameData.message.type}) from user(${userId}) to game(${gameData.gameId})`);

      return newState.context;
    }

    throw new functions.https.HttpsError(
      'cancelled',
      `Error occured while posting a message(${gameData.message.type}) from user(${userId}) to game(${gameData.gameId})`,
    );
  });

export const onLobbyUserRemove = functions
  .region('europe-west1')
  .database
  .ref('/lobbies/{lobbyId}/users/{userId}')
  .onDelete(async (removedUserSnapshot, context) => {
    const lobbyId = context.params.lobbyId as LobbyId;
    const lobbyRef = removedUserSnapshot.ref.parent!.parent!;
    const currentLobbySnapshot = await lobbyRef.get();
    const currentLobby = currentLobbySnapshot.val() as Lobby;

    const removedUser = removedUserSnapshot.val() as User;

    if (currentLobby.users === undefined) {
      functions.logger.info(`Last user (${removedUser.username}:${removedUser.userId}) left lobby(${lobbyId}). Closing the lobby...`);
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

export const onGamePlayerStatusChange = functions
  .region('europe-west1')
  .database
  .ref('/games/{gameId}/playersConnectionStatuses/{playerId}')
  .onUpdate(async (playerConnectionStatusChange, context) => {
    const gameId = context.params.gameId as LobbyId;
    const newPlayersConnectionStatusesRef = playerConnectionStatusChange.after.ref.parent!;

    const newPlayerConnectionStatusesSnapshot = await newPlayersConnectionStatusesRef.get();
    const newPlayerConnectionStatuses = newPlayerConnectionStatusesSnapshot.val() as Game['playersConnectionStatuses'];

    const areAllPlayersAbandoned = Object.values(newPlayerConnectionStatuses)
      .every((status) => status === PlayerConnectionStatus.ABANDONED);

    if (areAllPlayersAbandoned) {
      const gameRef = newPlayersConnectionStatusesRef.parent!;

      functions.logger.info(`All players abandoned game(${gameId}). Closing the game...`);
      await gameRef.remove();
      functions.logger.info(`Game(${gameId}) is closed`);
    }
  });
