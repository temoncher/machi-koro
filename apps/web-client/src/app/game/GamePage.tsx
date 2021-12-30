import './GamePage.css';
import {
  GameContext,
  GameState,
  UserStatus,
} from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks';
import {
  initializeSocket,
  joinGame,
  rollDice,
  startGame,
  pass,
  buildEstablishment,
  buildLandmark,
} from '../socket';
import { DiceCombination } from '../types';
import { UrlUtils } from '../utils';

import { DicePairView } from './DicePairView';
import { EstablishmentsShopView } from './EstablishmentsShopView';
import { PlayersView } from './PlayersView';

type GamePageProps = {
  className?: string;
};

const mockGame: GameState = {
  gameId: '',
  hostId: '',
  users: [{
    userId: 'firstPlayer',
    username: 'Artem',
    type: 'guest',
  },
  {
    userId: 'secondPlayer',
    username: 'Alex',
    type: 'guest',
  },
  {
    userId: 'thirdPlayer',
    username: 'Julia',
    type: 'guest',
  },
  {
    userId: 'fourthPlayer',
    username: 'Kirill',
    type: 'guest',
  }],
  usersStatusesMap: {
    Artem: UserStatus.CONNECTED,
    Alex: UserStatus.DISCONNECTED,
    Julia: UserStatus.DISCONNECTED,
    Kirill: UserStatus.CONNECTED,
  },
};

const mockGameContext: GameContext = {
  gameEstablishments: {
    bakery: {
      establishmentId: 'bakery',
      domain: 'shopsFactoriesAndMarket',
      tag: 'box',
      name: 'Bakery',
      tagSrc: 'http://localhost:3333/static/icons/factory.png',
      imageSrc: 'http://localhost:3333/static/establishment-images/bakery.png',
      activation: [2, 3],
      descriptionText: 'Get 1 coin from the bank on you turn only.',
      cost: 1,
    },
  },
  shop: {
    bakery: 1,
  },
  activePlayerId: 'firstPlayer',
  players: [
    {
      userId: 'firstPlayer',
    },
    {
      userId: 'secondPlayer',
    },
    {
      userId: 'thirdPlayer',
    },
    {
      userId: 'fourthPlayer',
    },
  ],
  establishments: {
    firstPlayer: {},
    secondPlayer: {},
    thirdPlayer: {},
    fourthPlayer: {},
  },
  coins: {
    firstPlayer: 54,
    secondPlayer: 3,
    thirdPlayer: 3,
    fourthPlayer: 20,
  },
  landmarks: {
    firstPlayer: {
      trainStation: false,
      shoppingMall: false,
      amusementPark: false,
      radioTower: false,
    },
    secondPlayer: {},
    thirdPlayer: {},
    fourthPlayer: {
      trainStation: false,
      shoppingMall: false,
      amusementPark: false,
      radioTower: false,
    },
  },
  gameLandmarks: {
    trainStation: {
      landmarkId: 'trainStation',
      domain: 'landmark',
      name: 'Train Station',
      cost: 4,
      tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
      imageSrc: 'http://localhost:3333/static/landmark-images/train-station.png',
      descriptionText: 'Roll 2 dice at the same time.',
    },
    shoppingMall: {
      landmarkId: 'shoppingMall',
      domain: 'landmark',
      name: 'Shopping Mall',
      cost: 10,
      tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
      imageSrc: 'http://localhost:3333/static/landmark-images/shopping-mall.png',
      descriptionText: 'Increase the number of coins you get for your Café and Restaurant by 1.',
    },
    amusementPark: {
      landmarkId: 'amusementPark',
      domain: 'landmark',
      name: 'Amusement Park',
      cost: 16,
      tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
      imageSrc: 'http://localhost:3333/static/landmark-images/amusement-park.png',
      descriptionText: 'Take another turn if you roll doubles.',
    },
    radioTower: {
      landmarkId: 'radioTower',
      domain: 'landmark',
      name: 'Radio tower',
      cost: 22,
      tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
      imageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
      descriptionText: 'You may re-roll your dice once each turn.',
    },
  },
  rollDiceResult: 3,
  winnerId: '',
};

const mockRolledDiceCombination: DiceCombination = [3, undefined];

export const GamePage: React.FC<GamePageProps> = (({ className }: GamePageProps) => {
  const { userId } = useTypedSelector((state) => state.loginReducer);
  const { t } = useTranslation();
  const gameId = useTypedSelector((state) => {
    const { pathname } = state.router.location;

    return UrlUtils.getLastSegment(pathname);
  });

  useEffect(() => {
    initializeSocket();

    if (gameId) {
      joinGame(gameId);
    } else {
      // eslint-disable-next-line no-console
      console.error('GameId is missing');
    }
  }, [gameId]);

  const requestToRollDice = () => {
    rollDice(userId);
  };
  const requestToPass = () => {
    pass(userId);
  };
  const requestToStartGame = () => {
    if (gameId) {
      startGame(gameId);
    }
  };

  return (
    <main className={clsx('game-page', className)}>
      <section className="game-page__game-view">
        <EstablishmentsShopView
          className="game-page__activation-cards"
          establishments={mockGameContext.gameEstablishments}
          shop={mockGameContext.shop}
          onEstablishmentClick={buildEstablishment(userId)}
        />
        <DicePairView className="game-page__dice-container" rolledDiceCombination={mockRolledDiceCombination} />
        <PlayersView
          className="game-page__players"
          coinsMap={mockGameContext.coins}
          establishmentsMap={mockGameContext.establishments}
          gameEstablishments={mockGameContext.gameEstablishments}
          gameLandmarks={mockGameContext.gameLandmarks}
          landmarksMap={mockGameContext.landmarks}
          players={mockGame.users}
          statusesMap={mockGame.usersStatusesMap}
          onLandmarkClick={buildLandmark(userId)}
        />
      </section>
      <section className="game-page__game-control">
        <button className="game-page__button" type="button" onClick={requestToStartGame}>{t('game.startGameButtonText')}</button>
        <button className="game-page__button" type="button" onClick={requestToRollDice}>{t('game.rollDiceButtonText')}</button>
        <button className="game-page__button" type="button" onClick={requestToPass}>{t('game.passButtonText')}</button>
        <button className="game-page__button" type="button">{t('game.finishTurnButtonText')}</button>
      </section>
    </main>
  );
});
