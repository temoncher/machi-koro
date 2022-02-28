import {
  Game,
  GameContext,
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

/** Firebase rtdb doesn't support undefined values https://stackoverflow.com/a/65312003/13104050 */
const sanitizeContext = (incomingContext: GameContext) => {
  const { winnerId, rolledDiceCombination, ...newContext } = incomingContext;

  return {
    ...newContext,
    winnerId: winnerId ?? null,
    rolledDiceCombination: rolledDiceCombination
      ? [rolledDiceCombination[0], rolledDiceCombination[1] ?? null]
      : null,
  };
};

const setupGameMachine = (players: UserId[], log: GameMachineMessage[]) => {
  const gameMachine = createGameMachine(players);

  const interpretedGameMachine = interpret(gameMachine).start();

  log.forEach((message) => {
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

    const gameMachine = setupGameMachine(currentGame.context.playersIds, currentGame.log ?? []);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const message = {
      ...gameData.message,
      userId,
      // TODO: figure out a way to avoid this cast
    } as GameMachineMessage;

    const newState = gameMachine.send(message);

    if (!newState.changed) {
      throw new functions.https.HttpsError(
        'cancelled',
        `Error occured while posting a message(${gameData.message.type}) from user(${userId}) to game(${gameData.gameId})`,
      );
    }

    const currentGameLog = currentGame.log ?? [];

    await gameRef.update({
      log: [...currentGameLog, message],
      context: sanitizeContext(newState.context),
    });

    functions.logger.info(`Successfully posted message(${gameData.message.type}) from user(${userId}) to game(${gameData.gameId})`);

    return newState.context;
  });

export const createGame = functions
  .region('europe-west1')
  .https
  .onCall(async (requestData) => {
    const { fromLobby } = requestData as { fromLobby: LobbyId };
    const lobbyRef = database.ref(`lobbies/${fromLobby}`);
    const lobbySnapshot = await lobbyRef.get();
    const lobby = lobbySnapshot.val() as Omit<Lobby, 'lobbyId'>;

    if (!lobby.users) {
      throw new functions.https.HttpsError('failed-precondition', `Failed to create game for lobby(${fromLobby}), users are missing`);
    }

    const playersConnectionStatuses = Object.fromEntries(
      Object.keys(lobby.users).map((userId) => [userId, PlayerConnectionStatus.DISCONNECTED]),
    );

    const gameMachine = setupGameMachine(Object.keys(lobby.users) as UserId[], []);

    const gameToCreate: Omit<Game, 'gameId'> = {
      players: lobby.users,
      playersConnectionStatuses,
      context: gameMachine.machine.context,
    };

    const createdGameRef = await database.ref('games').push({
      ...gameToCreate,
      context: sanitizeContext(gameToCreate.context),
    });

    // This cast is safe because only root database has a `null` key
    const gameId = createdGameRef.key! as GameId;

    const lobbyGameIdRef = database.ref(`lobbies/${fromLobby}/gameId`);

    await lobbyGameIdRef.set(gameId);

    functions.logger.info(`Game(${gameId}) created successfully from lobby(${fromLobby})`);

    return {
      ...gameToCreate,
      gameId,
    };
  });

export const onLobbyUserRemove = functions
  .region('europe-west1')
  .database
  .ref('/lobbies/{lobbyId}/users/{userId}')
  .onDelete(async (removedUserSnapshot, context) => {
    const lobbyId = context.params.lobbyId as LobbyId;
    const lobbyRef = removedUserSnapshot.ref.parent!.parent!;
    const currentLobbySnapshot = await lobbyRef.get();
    const currentLobby = currentLobbySnapshot.val() as Omit<Lobby, 'lobbyId'>;

    const removedUser = removedUserSnapshot.val() as User;

    if (currentLobby.users === undefined) {
      functions.logger.info(`Last user (${removedUser.username}:${removedUser.userId}) left lobby(${lobbyId}). Closing the lobby...`);
      await lobbyRef.remove();
      functions.logger.info(`Lobby(${lobbyId}) is closed`);

      return;
    }

    await lobbyRef.child(`readyStates/${removedUser.userId}`).remove();

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
