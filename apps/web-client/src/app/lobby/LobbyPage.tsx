import { LoadingButton } from '@mui/lab';
import {
  Button,
  Box,
  Typography,
  SxProps,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../hooks';

import { UserCard } from './UserCard';
import { LobbyAction } from './lobby.actions';

type LobbyPageProps = {
  sx?: SxProps;
};

export const LobbyPage: React.FC<LobbyPageProps> = (props) => {
  const { userId } = useTypedSelector((state) => state.loginReducer);
  const lobby = useTypedSelector((state) => state.lobbyReducer.lobby);
  const { isLoading } = useTypedSelector((state) => state.requests.createGameReducer);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.sx,
      }}
    >
      <Box component="section">
        <Box>
          <Typography sx={{ mb: 2 }} variant="h6">{t('lobby.playersSectionTitle')}</Typography>
          <Box sx={{ '> *': { mb: 1 } }}>
            {lobby?.users && Object.values(lobby.users).map((user) => (
              <UserCard
                key={user.userId}
                highlighted={user.userId === userId}
                user={user}
                withCrown={user.userId === lobby.hostId}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 2, '> :not(:last-child).MuiButton-root': { mr: 2 } }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            loadingIndicator={t('lobby.startNewGameButtonTextLoading')}
            onClick={() => {
              dispatch(LobbyAction.createGameButtonClickedEvent());
            }}
          >
            {t('lobby.startNewGameButtonText')}
          </LoadingButton>
          <Button href="../" variant="contained">
            {t('lobby.leaveLobbyButtonText')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
