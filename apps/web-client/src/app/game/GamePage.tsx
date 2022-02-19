import { GameContext } from '@machikoro/game-server-contracts';
import { Box, Button, SxProps } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks';
import { DiceCombination } from '../types/Dice';

import { DiceCombinationView } from './components/DiceCombinationView';
import { EstablishmentsShopView } from './EstablishmentsShopView';
import { PlayersView } from './PlayersView';
import { useGameActions } from './useGameActions';

const mockGameContext: GameContext = {
  gameEstablishments: {
    wheatField: {
      establishmentId: 'wheatField',
      domain: 'industry',
      tag: 'wheat',
      name: 'Wheat field',
      cost: 1,
      activation: [1],
      tagSrc: 'http://localhost:3333/static/icons/wheat.png',
      imageSrc: 'http://localhost:3333/static/establishment-images/flower-garden.png',
      descriptionText: 'Receive 1 coin from the bank regardless of whose turn it is.',
    },
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
    livestockFarm: {
      establishmentId: 'livestockFarm',
      domain: 'industry',
      tag: 'livestock',
      name: 'Livestock Farm',
      cost: 1,
      activation: [2],
      tagSrc: 'http://localhost:3333/static/icons/cow.png',
      imageSrc: 'http://localhost:3333/static/establishment-images/ranch.png',
      descriptionText: 'Receive 1 coin from the bank regardless of whose turn it is.',
    },
    cafe: {
      establishmentId: 'cafe',
      domain: 'restaurant',
      tag: 'cup',
      name: 'Cafe',
      cost: 2,
      activation: [3],
      tagSrc: 'http://localhost:3333/static/icons/cup.png',
      imageSrc: 'http://localhost:3333/static/establishment-images/cafe.png',
      descriptionText: 'Receive 1 coin from any player who rolls this number.',
    },
  },
  shop: {
    bakery: 10,
    wheat: 13,
    livestockFarm: 5,
    cafe: 2,
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

type GamePageProps = {
  sx?: SxProps;
};

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
    <Box
      component="main"
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) => theme.palette.grey[100],
        ...props.sx,
      }}
    >
      <Box
        component="section"
        sx={{
          pb: 2,
          display: 'flex',
          flexGrow: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 0,
            height: 8,
            cursor: 'pointer',
          },
          '&::-webkit-scrollbar-track': {
            borderRadius: 2,
            bgcolor: (theme) => theme.palette.primary.dark,
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 2,
            bgcolor: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <Box
          sx={{
            mr: 2,
            p: 2,
            display: 'flex',
            flexGrow: 1,
            borderRadius: 2,
            bgcolor: (theme) => theme.palette.primary.main,
          }}
        >
          <EstablishmentsShopView
            sx={{ flexGrow: 1 }}
            establishments={mockGameContext.gameEstablishments}
            shop={mockGameContext.shop}
            onEstablishmentClick={buildEstablishmentCommand}
          />
          <DiceCombinationView sx={{ flexGrow: 0 }} rolledDiceCombination={mockRolledDiceCombination} />
        </Box>

        <PlayersView
          sx={{ flexGrow: 0 }}
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
      </Box>

      <Box
        component="section"
        sx={{
          flexGrow: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          '> :not(:last-child)': {
            mr: 2,
          },
        }}
      >
        <Button variant="contained" onClick={startGameCommand}>{t('game.startGameButtonText')}</Button>
        <Button variant="contained" onClick={rollDiceCommand}>{t('game.rollDiceButtonText')}</Button>
        <Button variant="contained" onClick={passCommand}>{t('game.passButtonText')}</Button>
        <Button variant="contained">{t('game.finishTurnButtonText')}</Button>
      </Box>
    </Box>
  );
};
