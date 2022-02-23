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
  const { isLoading } = useTypedSelector((state) => state.requests.leaveLobbyReducer);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const dispatchCreateGameButtonClickedEvent = () => {
    dispatch(LobbyAction.createGameButtonClickedEvent());
  };

  const dispatchLeaveLobbyButtonClickedEvent = () => {
    dispatch(LobbyAction.leaveLobbyButtonClickedEvent());
  };

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
          <Button type="submit" variant="contained" onClick={dispatchCreateGameButtonClickedEvent}>
            {t('lobby.startNewGameButtonText')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={isLoading}
            loadingIndicator={t('lobby.leaveLobbyButtonTextLoading')}
            onClick={dispatchLeaveLobbyButtonClickedEvent}
          >
            {t('lobby.leaveLobbyButtonText')}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};
