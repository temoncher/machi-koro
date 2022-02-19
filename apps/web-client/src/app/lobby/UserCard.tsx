import { User } from '@machikoro/game-server-contracts';
import {
  Avatar,
  Typography,
  Card,
  CardHeader,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import profilePlaceholderImage from '../../assets/images/profile/profile-placeholder.png';

type UserCardProps = {
  user: User;
  highlighted: boolean;
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
        borderColor: (theme) => (props.highlighted ? theme.palette.warning.light : undefined),
      }}
    >
      <CardHeader
        sx={{ p: 0 }}
        avatar={<Avatar alt={props.user.username} src={profilePlaceholderImage} />}
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
