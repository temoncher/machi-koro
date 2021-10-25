import './GamePage.css';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks';
import {
  initializeSocket,
  joinGame,
  rollDice,
  startGame,
} from '../socket';
import {
  CommonEstablishment,
  DiceCombination,
  Player,
  Status,
} from '../types';
import { UrlUtils } from '../utils';

import { DicePairView } from './DicePairView';
import { EstablishmentsShopView } from './EstablishmentsShopView';
import { PlayersView } from './PlayersView';

type GamePageProps = {
  className?: string;
};

const mockEstablishmentsShop: CommonEstablishment[] = [
  {
    type: 'shopsFactoriesAndMarket',
    name: 'Bakery',
    tagSrc: 'http://localhost:3333/static/icons/factory.png',
    establishmentImageSrc: 'http://localhost:3333/static/establishment-images/bakery.png',
    activationDice: [2, 3],
    descriptionText: 'Get 1 coin from the bank on you turn only.',
    count: 1,
  },
];

const mockPlayers: Player[] = [
  {
    username: 'Artem',
    status: Status.NOT_ACTIVE,
    cards: [
      {
        type: 'industry',
        name: 'Bakery',
        tagSrc: 'http://localhost:3333/static/icons/factory.png',
        establishmentImageSrc: 'http://localhost:3333/static/establishment-images/bakery.png',
        activationDice: [2, 3],
        descriptionText: 'Get 1 coin from the bank on you turn only.',
        count: 1,
      },
    ],
    coins: 54,
    landmarks: [
      {
        type: 'landmark',
        name: 'Radio Tower',
        tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
        establishmentImageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
        buildCost: 22,
        descriptionText: 'Once every turnm you can choose to re-roll your dice',
        underConstruction: false,
      },
      {
        type: 'landmark',
        name: 'Radio Tower',
        tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
        establishmentImageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
        buildCost: 22,
        descriptionText: 'Once every turnm you can choose to re-roll your dice',
        underConstruction: false,
      },
      {
        type: 'landmark',
        name: 'Radio Tower',
        tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
        establishmentImageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
        buildCost: 22,
        descriptionText: 'Once every turnm you can choose to re-roll your dice',
        underConstruction: false,
      },
    ],
  },
  {
    username: 'Alex',
    status: Status.ACTIVE,
    cards: [
    ],
    coins: 54,
    landmarks: [
      {
        type: 'landmark',
        name: 'Radio Tower',
        tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
        establishmentImageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
        buildCost: 22,
        descriptionText: 'Once every turnm you can choose to re-roll your dice',
        underConstruction: false,
      },
      {
        type: 'landmark',
        name: 'Radio Tower',
        tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
        establishmentImageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
        buildCost: 22,
        descriptionText: 'Once every turnm you can choose to re-roll your dice',
        underConstruction: false,
      },
      {
        type: 'landmark',
        name: 'Radio Tower',
        tagSrc: 'http://localhost:3333/static/icons/landmark-icon.png',
        establishmentImageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
        buildCost: 22,
        descriptionText: 'Once every turnm you can choose to re-roll your dice',
        underConstruction: false,
      },
    ],
  },
  {
    username: 'Kirill',
    status: Status.ACTIVE,
    cards: [],
    coins: 54,
    landmarks: [],
  },
  {
    username: 'Julia',
    status: Status.NOT_ACTIVE,
    cards: [],
    coins: 54,
    landmarks: [],
  },
];

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
  const requestToStartGame = () => {
    if (gameId) {
      startGame(gameId);
    }
  };

  return (
    <main className={clsx('game-page', className)}>
      <section className="game-page__game-view">
        <EstablishmentsShopView className="game-page__activation-cards" establishmentsShop={mockEstablishmentsShop} />
        <DicePairView className="game-page__dice-container" rolledDiceCombination={mockRolledDiceCombination} />
        <PlayersView className="game-page__players" players={mockPlayers} />
      </section>
      <section className="game-page__game-control">
        <button type="button" className="game-page__button" onClick={requestToStartGame}>{t('game.startGameButtonText')}</button>
        <button type="button" className="game-page__button" onClick={requestToRollDice}>{t('game.rollDiceButtonText')}</button>
        <button type="button" className="game-page__button">{t('game.passButtonText')}</button>
        <button type="button" className="game-page__button">{t('game.finishTurnButtonText')}</button>
      </section>
    </main>
  );
});
