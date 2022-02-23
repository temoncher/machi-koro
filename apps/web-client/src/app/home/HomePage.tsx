import { LoadingButton } from '@mui/lab';
import {
  Box,
  SxProps,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../hooks';

import { CreateLobbyAction } from './createLobby.endpoint';

type HomePageProps = {
  sx?: SxProps;
};

export const HomePage: React.FC<HomePageProps> = (props) => {
  const dispatch = useDispatch();
  const { userId, username } = useTypedSelector((state) => state.loginReducer);
  const { isLoading } = useTypedSelector((state) => state.requests.createLobbyReducer);
  const { t } = useTranslation();

  const dispatchCreateLobbyCommand = () => {
    dispatch(CreateLobbyAction.createLobbyCommand([userId!, 4]));
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.sx,
      }}
    >
      <Box sx={{ maxWidth: 800, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">
          {/* TODO: figure out how to use string interpolation with bold wrapper */}
          {t('home.greeting.start')}
          <b>{username}</b>
          {t('home.greeting.end')}
        </Typography>
        <Typography sx={{ py: 2 }}>{t('home.welcomeText')}</Typography>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          loadingIndicator={t('home.createNewLobbyButtonTextLoading')}
          onClick={dispatchCreateLobbyCommand}
        >
          {t('home.createNewLobbyButtonText')}
        </LoadingButton>
      </Box>
    </Box>
  );
};
