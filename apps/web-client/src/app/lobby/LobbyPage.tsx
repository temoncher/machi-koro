import {
  Button,
  Box,
  Typography,
  SxProps,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGameActions } from '../game/useGameActions';
import { useTypedSelector } from '../hooks';
import { UrlUtils } from '../utils/url.utils';

import { UserCard } from './UserCard';
import { useLobbyActions } from './useLobbyActions';

type LobbyPageProps = {
  sx?: SxProps;
};

export const LobbyPage: React.FC<LobbyPageProps> = (props) => {
  const { userId } = useTypedSelector((state) => state.loginReducer);
  const lobby = useTypedSelector((state) => state.lobbyReducer.lobby);
  const { t } = useTranslation();
  const lobbyId = useTypedSelector((state) => {
    const { pathname } = state.router.location;

    return UrlUtils.getLastSegment(pathname);
  });

  const { createGameCommand } = useGameActions();
  const { leaveLobbyCommand } = useLobbyActions();

  const createGame = (): void => {
    if (lobbyId) {
      createGameCommand({ lobbyId });
    } else {
      // eslint-disable-next-line no-console
      console.error('LobbyId is missing');
    }
  };

  const requestToLeaveLobby = () => {
    if (lobbyId) {
      leaveLobbyCommand(lobbyId);
    } else {
      // eslint-disable-next-line no-console
      console.error('LobbyId is missing');
    }
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
          <Box>
            {lobby?.users.map((user) => (
              <UserCard
                key={user.userId}
                highlighted={user.userId === userId}
                user={user}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 2, '> :not(:last-child).MuiButton-root': { mr: 2 } }}>
          <Button type="submit" variant="contained" onClick={createGame}>
            {t('lobby.startNewGameButtonText')}
          </Button>
          <Button variant="contained" onClick={requestToLeaveLobby}>
            {t('lobby.leaveLobbyButtonText')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
