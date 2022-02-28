import { Box, Button, SxProps } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../hooks';

import { EstablishmentsShopView } from './EstablishmentsShopView';
import { PlayersView } from './PlayersView';
import { DiceCombinationView } from './components/DiceCombinationView';
import { GameAction } from './game.actions';

type GamePageProps = {
  sx?: SxProps;
};

export const GamePage: React.FC<GamePageProps> = (props) => {
  const { t } = useTranslation();
  const game = useTypedSelector((state) => state.gameReducer.game);
  const dispatch = useDispatch();

  // TODO: translate
  if (!game) return <>Loading...</>;

  return (
    <Box
      component="main"
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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
            establishments={game.context.gameEstablishments}
            shop={game.context.shop}
            onEstablishmentClick={(establishmentId) => {
              dispatch(GameAction.buildEstablishmentCommand(establishmentId));
            }}
          />
          <DiceCombinationView sx={{ flexGrow: 0 }} rolledDiceCombination={game.context.rolledDiceCombination} />
        </Box>

        <PlayersView
          sx={{ flexGrow: 0 }}
          coinsMap={game.context.coins}
          establishmentsMap={game.context.establishments}
          gameEstablishments={game.context.gameEstablishments}
          gameLandmarks={game.context.gameLandmarks}
          landmarksMap={game.context.landmarks}
          players={game.context.playersIds.map((userId) => ({
            userId,
            username: userId,
          }))}
          statusesMap={game.playersConnectionStatuses}
          onLandmarkClick={(landmarkId) => {
            dispatch(GameAction.buildLandmarkCommand(landmarkId));
          }}
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
        <Button
          variant="contained"
          onClick={() => {
            dispatch(GameAction.rollDiceCommand());
          }}
        >
          {t('game.rollDiceButtonText')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(GameAction.passCommand());
          }}
        >
          {t('game.passButtonText')}
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            dispatch(GameAction.abandonGameButtonClickedEvent());
          }}
        >
          {t('game.abandonGameButtonText')}
        </Button>
      </Box>
    </Box>
  );
};
