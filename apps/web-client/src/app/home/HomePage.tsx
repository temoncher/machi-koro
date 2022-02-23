import {
  Box,
  Button,
  SxProps,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks';
import { useLobbyActions } from '../lobby';

type HomePageProps = {
  sx?: SxProps;
};

export const HomePage: React.FC<HomePageProps> = (props) => {
  const { createLobbyCommand } = useLobbyActions();
  const { username } = useTypedSelector((state) => state.loginReducer);
  const { isCreateLobbyLoading } = useTypedSelector((state) => state.lobbyReducer);
  const { t } = useTranslation();

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
        <Button variant="contained" disabled={isCreateLobbyLoading} onClick={createLobbyCommand}>
          {t('home.createNewLobbyButtonText')}
        </Button>
      </Box>
    </Box>
  );
};
