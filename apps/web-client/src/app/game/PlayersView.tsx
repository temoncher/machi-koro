import {
  Establishment,
  EstablishmentId,
  Landmark,
  LandmarkId,
  User,
  UserId,
  UsersStatusesMap,
  UserStatus,
} from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import './PlayersView.css';
import React, { memo, useMemo } from 'react';

import { PlayerView } from './PlayerView';

type PlayersViewProps = {
  className?: string;
  players: User[];
  statusesMap: UsersStatusesMap;
  coinsMap: Record<UserId, number>;
  landmarksMap: Record<UserId, Record<LandmarkId, boolean>>;
  establishmentsMap: Record<UserId, Record<EstablishmentId, number>>;
  gameLandmarks: Record<LandmarkId, Landmark>;
  gameEstablishments: Record<EstablishmentId, Establishment>;
  onLandmarkClick: (landmarkId: string) => void;
};

export const PlayersView: React.FC<PlayersViewProps> = memo((playersViewProps: PlayersViewProps) => {
  const defaultLandmarks = useMemo(
    () => Object.fromEntries(Object.keys(playersViewProps.gameLandmarks).map((landmarkId) => [landmarkId, false])),
    [playersViewProps.gameLandmarks],
  );

  return (
    <div className={clsx('players', playersViewProps.className)}>
      {playersViewProps.players.map((player) => (
        <PlayerView
          key={player.userId}
          className="players__player-view"
          coins={playersViewProps.coinsMap[player.userId] ?? 0}
          establishments={playersViewProps.establishmentsMap[player.userId] ?? {}}
          gameEstablishments={playersViewProps.gameEstablishments}
          gameLandmarks={playersViewProps.gameLandmarks}
          landmarks={playersViewProps.landmarksMap[player.userId] ?? defaultLandmarks}
          player={player}
          status={playersViewProps.statusesMap[player.userId] ?? UserStatus.DISCONNECTED}
          onLandmarkClick={playersViewProps.onLandmarkClick}
        />
      ))}
    </div>
  );
});
