import { GameContext } from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks';
import { DiceCombination } from '../types';

import { DicePairView } from './DicePairView';
import { EstablishmentsShopView } from './EstablishmentsShopView';
import { PlayersView } from './PlayersView';
import { useGameActions } from './useGameActions';

import './GamePage.css';

type GamePageProps = {
  className?: string;
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

export const GamePage: React.FC<GamePageProps> = (props) => {
  const { t } = useTranslation();
  const game = useTypedSelector((state) => state.gameReducer.game);

  const {
    rollDiceCommand,
    passCommand,
    startGameCommand,
    buildEstablishmentCommand,
    buildLandmarkCommand,
  } = useGameActions();

  return (
    <main className={clsx('game-page', props.className)}>
      <section className="game-page__game-view">
        <EstablishmentsShopView
          className="game-page__activation-cards"
          establishments={mockGameContext.gameEstablishments}
          shop={mockGameContext.shop}
          onEstablishmentClick={buildEstablishmentCommand}
        />
        <DicePairView className="game-page__dice-container" rolledDiceCombination={mockRolledDiceCombination} />
        <PlayersView
          className="game-page__players"
          coinsMap={mockGameContext.coins}
          establishmentsMap={mockGameContext.establishments}
          gameEstablishments={mockGameContext.gameEstablishments}
          gameLandmarks={mockGameContext.gameLandmarks}
          landmarksMap={mockGameContext.landmarks}
          // TODO: rework this part
          players={mockGameContext.players.map(({ userId }) => ({
            type: 'guest',
            userId,
            username: userId,
          }))}
          // TODO: rework this part
          statusesMap={game?.usersStatusesMap ?? {}}
          onLandmarkClick={buildLandmarkCommand}
        />
      </section>
      <section className="game-page__game-control">
        <button className="game-page__button" type="button" onClick={startGameCommand}>{t('game.startGameButtonText')}</button>
        <button className="game-page__button" type="button" onClick={rollDiceCommand}>{t('game.rollDiceButtonText')}</button>
        <button className="game-page__button" type="button" onClick={passCommand}>{t('game.passButtonText')}</button>
        <button className="game-page__button" type="button">{t('game.finishTurnButtonText')}</button>
      </section>
    </main>
  );
};
