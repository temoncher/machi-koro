import {
  Establishment,
  EstablishmentId,
  Landmark,
  LandmarkId,
  User,
  UserId,
  PlayerConnectionStatusesMap,
  PlayerConnectionStatus,
} from '@machikoro/game-server-contracts';
import { Box, SxProps } from '@mui/material';
import React, { useMemo } from 'react';

import { PlayerView } from './PlayerView';

type PlayersViewProps = {
  sx?: SxProps;
  players: User[];
  statusesMap: PlayerConnectionStatusesMap;
  coinsMap: Record<UserId, number>;
  landmarksMap: Record<UserId, Record<LandmarkId, boolean>>;
  establishmentsMap: Record<UserId, Record<EstablishmentId, number>>;
  gameLandmarks: Record<LandmarkId, Landmark>;
  gameEstablishments: Record<EstablishmentId, Establishment>;
  onLandmarkClick: (landmarkId: LandmarkId) => void;
};

export const PlayersView: React.FC<PlayersViewProps> = (props: PlayersViewProps) => {
  const defaultLandmarks = useMemo(
    () => Object.fromEntries(Object.keys(props.gameLandmarks).map((landmarkId) => [landmarkId, false])),
    [props.gameLandmarks],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        '> :not(:last-child)': {
          mr: 1,
        },
        ...props.sx,
      }}
    >
      {props.players.map((player) => (
        <PlayerView
          key={`Players_${player.userId}`}
          coins={props.coinsMap[player.userId] ?? 0}
          establishments={props.establishmentsMap[player.userId] ?? {}}
          gameEstablishments={props.gameEstablishments}
          gameLandmarks={props.gameLandmarks}
          landmarks={props.landmarksMap[player.userId] ?? defaultLandmarks}
          player={player}
          status={props.statusesMap[player.userId] ?? PlayerConnectionStatus.DISCONNECTED}
          onLandmarkClick={props.onLandmarkClick}
        />
      ))}
    </Box>
  );
};
