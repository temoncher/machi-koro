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
import React, { useMemo } from 'react';

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
  onLandmarkClick: (landmarkId: LandmarkId) => void;
};

export const PlayersView: React.FC<PlayersViewProps> = (props: PlayersViewProps) => {
  const defaultLandmarks = useMemo(
    () => Object.fromEntries(Object.keys(props.gameLandmarks).map((landmarkId) => [landmarkId, false])),
    [props.gameLandmarks],
  );

  return (
    <div className={clsx('players', props.className)}>
      {props.players.map((player) => (
        <PlayerView
          key={player.userId}
          className="players__player-view"
          coins={props.coinsMap[player.userId] ?? 0}
          establishments={props.establishmentsMap[player.userId] ?? {}}
          gameEstablishments={props.gameEstablishments}
          gameLandmarks={props.gameLandmarks}
          landmarks={props.landmarksMap[player.userId] ?? defaultLandmarks}
          player={player}
          status={props.statusesMap[player.userId] ?? UserStatus.DISCONNECTED}
          onLandmarkClick={props.onLandmarkClick}
        />
      ))}
    </div>
  );
};
