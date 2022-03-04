import {
  Establishment,
  EstablishmentId,
  Landmark,
  LandmarkId,
  User,
  PlayerConnectionStatus,
} from '@machikoro/game-server-contracts';
import {
  Box,
  Typography,
  Divider,
  SxProps,
} from '@mui/material';
import React from 'react';

import { CoinView } from './components/CoinView';
import { EstablishmentView } from './components/EstablishmentView';
import { LandmarkView } from './components/LandmarkView';
import { MinimizedEstablishmentView } from './components/MinimizedEstablishmentView';
import { MinimizedLandmarkView } from './components/MinimizedLandmarkView';

type PlayerViewHeaderProps = {
  sx?: SxProps;
  status: PlayerConnectionStatus;
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
          bgcolor: (theme) => (props.status === PlayerConnectionStatus.CONNECTED
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

type EstablishmentCardWithHoverProps = {
  sx?: SxProps;
  establishment: Establishment;
  count: number;
};

const EstablishmentCardWithHover: React.FC<EstablishmentCardWithHoverProps> = (props): JSX.Element | null => (
  <Box
    sx={{
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '&:hover .show-on-parent-hover': {
        display: 'block',
      },
      ...props.sx,
    }}
  >
    <MinimizedEstablishmentView
      establishment={props.establishment}
      quantity={props.count}
    />
    <EstablishmentView
      sx={{
        bottom: 0,
        right: '110%',
        display: 'none',
        position: 'absolute',
      }}
      className="show-on-parent-hover"
      establishment={props.establishment}
      quantity={props.count}
    />
  </Box>
);

type PlayerViewProps = {
  sx?: SxProps;
  player: User;
  coins: number;
  status: PlayerConnectionStatus;
  landmarks: Record<LandmarkId, boolean>;
  establishments: Record<EstablishmentId, number>;
  gameLandmarks: Record<LandmarkId, Landmark>;
  gameEstablishments: Record<EstablishmentId, Establishment>;
  onLandmarkClick: (landmarkId: LandmarkId) => void;
};

export const PlayerView: React.FC<PlayerViewProps> = (props: PlayerViewProps) => (
  <Box
    sx={{
      p: 2,
      // TODO: deal with long player names
      width: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      bgcolor: (theme) => theme.palette.backgroundBlue.main,
      '> div,hr': {
        mb: 1,
      },
      ...props.sx,
    }}
  >
    <PlayerViewHeader
      status={props.status}
      username={props.player.username}
      coins={props.coins}
    />

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        rowGap: 1,
        columnGap: 1,
      }}
    >
      {Object.values(props.gameLandmarks).map((landmark) => (
        <Box
          key={`PlayerView_${props.player.userId}_${landmark.landmarkId}`}
          sx={{
            position: 'relative',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '&:hover .show-on-parent-hover': {
              display: 'block',
            },
          }}
        >
          <MinimizedLandmarkView
            landmark={landmark}
            underConstruction={!props.landmarks[landmark.landmarkId]}
            onClick={() => {
              props.onLandmarkClick(landmark.landmarkId);
            }}
          />
          <LandmarkView
            sx={{
              bottom: 0,
              right: '110%',
              display: 'none',
              position: 'absolute',
            }}
            className="show-on-parent-hover"
            landmark={landmark}
            underConstruction={!props.landmarks[landmark.landmarkId]}
            onClick={() => {
              props.onLandmarkClick(landmark.landmarkId);
            }}
          />
        </Box>
      ))}
    </Box>

    <Divider />

    <Box
      sx={{
        position: 'relative',
        height: '100%',
        minHeight: 180 + 20 * (Object.values(props.establishments).length - 1),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {Object.entries(props.establishments).map(
        ([establishmentId, count], cardIndex) => {
          const establishment = props.gameEstablishments[establishmentId as EstablishmentId];

          if (!establishment) return null;

          return (
            <EstablishmentCardWithHover
              key={`PlayerView_${establishment.establishmentId}`}
              sx={{
                position: 'absolute',
                top: 30 * cardIndex,
                zIndex: 20,
              }}
              establishment={establishment}
              count={count}
            />
          );
        },
      )}
    </Box>
  </Box>
);
