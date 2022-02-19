import {
  Establishment,
  EstablishmentId,
  Landmark,
  LandmarkId,
  User,
  UserStatus,
} from '@machikoro/game-server-contracts';
import { Box, Typography, SxProps } from '@mui/material';
import React from 'react';

import { CommonEstablishmentView } from './CardView';
import { CoinView } from './CoinView';
import { MinimizedLandmarkView } from './MinimizedCardView';

type PlayerViewHeaderProps = {
  sx?: SxProps;
  status: UserStatus;
  username: string;
  coins: number;
};

const PlayerViewHeader: React.FC<PlayerViewHeaderProps> = (props) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      ...props.sx,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          mr: 1,
          height: 10,
          width: 10,
          borderRadius: 1e5,
          bgcolor: (theme) => (props.status === UserStatus.CONNECTED
            ? theme.palette.success.main
            : theme.palette.error.main),
        }}
      />
      <Typography fontFamily="lithos" fontWeight={800}>
        {props.username}
      </Typography>
    </Box>

    <CoinView type="bronze">{props.coins}</CoinView>
  </Box>
);

type PlayerViewProps = {
  player: User;
  coins: number;
  gameLandmarks: Record<LandmarkId, Landmark>;
  status: UserStatus;
  establishments: Record<EstablishmentId, number>;
  gameEstablishments: Record<EstablishmentId, Establishment>;
  landmarks: Record<LandmarkId, boolean>;
  onLandmarkClick: (landmarkId: LandmarkId) => void;
};

export const PlayerView: React.FC<PlayerViewProps> = (props: PlayerViewProps) => {
  const renderCard = (establishmentId: EstablishmentId, count: number, cardIndex: number): JSX.Element | null => {
    const currentEstablishments = props.gameEstablishments[establishmentId];

    if (!currentEstablishments) return null;

    return (
      <Box
        key={establishmentId}
        sx={{
          '--number': cardIndex,
          position: 'absolute',
          top: 'calc(20px * var(--number))',
          zIndex: 20,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          '&:hover .show-on-parent-hover': {
            display: 'block',
          },
        }}
      >
        <CommonEstablishmentView
          key={establishmentId}
          cardInfo={currentEstablishments}
          quantity={count}
        />
        <CommonEstablishmentView
          key={establishmentId}
          sx={{
            bottom: 0,
            right: '110%',
            display: 'none',
            position: 'absolute',
          }}
          className="show-on-parent-hover"
          cardInfo={currentEstablishments}
          quantity={count}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        p: 2,
        // TODO: deal with long player names
        minWidth: 200,
        width: 200,
        maxWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        bgcolor: (theme) => theme.palette.warning.light,
      }}
    >
      <PlayerViewHeader
        sx={{ mb: 1 }}
        status={props.status}
        username={props.player.username}
        coins={props.coins}
      />

      <Box
        sx={{
          mt: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          rowGap: 2,
        }}
      >
        {Object.values(props.gameLandmarks).map((landmark) => (
          <MinimizedLandmarkView
            cardInfo={landmark}
            underConstruction={!props.landmarks[landmark.landmarkId]}
            onClick={() => {
              props.onLandmarkClick(landmark.landmarkId);
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          height: '100%',
          minHeight: 180 + 20 * (Object.values(props.establishments).length - 1),
          display: 'flex',
        }}
      >
        {Object.entries(props.establishments).map(
          ([establishmentId, count], cardIndex) => renderCard(establishmentId, count, cardIndex),
        )}
      </Box>
    </Box>
  );
};
