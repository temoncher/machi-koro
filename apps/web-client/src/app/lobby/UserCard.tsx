import { User } from '@machikoro/game-server-contracts';
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardHeader,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import profilePlaceholderImage from '../../assets/images/profile/profile-placeholder.png';

import { ReactComponent as CrownSvg } from './crown-solid.svg';

type UserCardProps = {
  user: User;
  highlighted: boolean;
  withCrown: boolean;
};

export const UserCard: React.FC<UserCardProps> = (props: UserCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: (theme) => theme.palette.primary.main,
        borderWidth: 4,
        borderStyle: 'solid',
        borderColor: (theme) => (props.highlighted ? theme.palette.warning.light : 'transparent'),
      }}
    >
      <CardHeader
        sx={{ p: 0 }}
        avatar={(
          <Box
            sx={{
              position: 'relative',
              '& svg': {
                fill: (theme) => theme.palette.warning.light,
              },
            }}
          >
            {props.withCrown && (
              // TODO: make this one translatable
              <Tooltip title="Host" placement="top-end">
                <CrownSvg
                  height={24}
                  style={{
                    position: 'absolute',
                    top: -16,
                    left: -8,
                    transform: 'rotate(-30deg)',
                    zIndex: 2,
                  }}
                />
              </Tooltip>
            )}
            <Avatar alt={props.user.username} src={profilePlaceholderImage} />
          </Box>
        )}
        title={<Typography color={(theme) => theme.palette.primary.contrastText} variant="h6">{props.user.username}</Typography>}
        subheader={(
          <Typography color={(theme) => theme.palette.primary.contrastText} variant="body2">
            {t('lobby.guestCardSubtitleText')}
          </Typography>
        )}
      />
    </Card>
  );
};
