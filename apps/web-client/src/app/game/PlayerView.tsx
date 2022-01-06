import './PlayerView.css';

import {
  Establishment,
  EstablishmentId,
  Landmark,
  LandmarkId,
  User,
  UserStatus,
} from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import React, { memo, useMemo } from 'react';

import { CommonEstablishmentView, LandmarkView } from './CardView';

type PlayerViewProps = {
  className?: string;
  player: User;
  coins: number;
  gameLandmarks: Record<LandmarkId, Landmark>;
  status: UserStatus;
  establishments: Record<EstablishmentId, number>;
  gameEstablishments: Record<EstablishmentId, Establishment>;
  landmarks: Record<LandmarkId, boolean>;
  onLandmarkClick: (landmarkId: string) => void;
};

export const PlayerView: React.FC<PlayerViewProps> = memo((playerViewProps: PlayerViewProps) => {
  const playerStatusClass = useMemo(
    () => (playerViewProps.status === UserStatus.CONNECTED ? 'player-view__status--green' : 'player-view__status--red'),
    [playerViewProps.status],
  );

  const renderCard = (establishmentId: string, count: number, cardIndex: number): JSX.Element | null => {
    const currentEstablishments = playerViewProps.gameEstablishments[establishmentId];

    return currentEstablishments ? (
      <div className="player-view__card-container" style={{ ['--number' as string]: cardIndex }}>
        <CommonEstablishmentView
          key={establishmentId}
          cardInfo={currentEstablishments}
          quantity={count}
        />
        <CommonEstablishmentView
          key={establishmentId}
          cardInfo={currentEstablishments}
          className="player-view__show-card"
          quantity={count}
          size="lg"
        />
      </div>
    ) : null;
  };

  return (
    <div className={clsx('player-view', playerViewProps.className)}>
      <div className="player-view__info">
        <div className="player-view__headline">
          <div className="player-view__status-container">
            <div className={clsx('player-view__status', playerStatusClass)} />
          </div>
          <span className="player-view__coins-container">
            <span className="player-view__coins-background">
              <span className="player-view__coins">{playerViewProps.coins}</span>
            </span>
          </span>
        </div>
        <p className="player-view__username">{playerViewProps.player.username}</p>
      </div>
      <div className="player-view__landmarks">
        {Object.values(playerViewProps.gameLandmarks).map((landmark) => (
          <LandmarkView
            cardInfo={landmark}
            size="xs"
            underConstruction={!!playerViewProps.landmarks[landmark.landmarkId]}
            onClick={() => {
              playerViewProps.onLandmarkClick(landmark.landmarkId);
            }}
          />
        ))}
      </div>
      <div
        className="player-view__cards"
        style={{ ['--cards-number' as string]: Object.values(playerViewProps.establishments).length - 1 }}
      >
        {Object.entries(playerViewProps.establishments).map(
          ([establishmentId, count], cardIndex) => renderCard(establishmentId, count, cardIndex),
        )}
      </div>
    </div>
  );
});
