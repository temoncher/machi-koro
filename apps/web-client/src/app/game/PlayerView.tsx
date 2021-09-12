import clsx from 'clsx';
import './PlayerView.css';
import React, { memo, useMemo } from 'react';

import { Player, Status } from '../types';

import { CommonEstablishmentView, LandmarkView } from './CardView';

type PlayerViewProps = {
  className?: string;
  player: Player;
};

export const PlayerView: React.FC<PlayerViewProps> = memo(({
  className, player,
}: PlayerViewProps) => {
  const {
    username,
    status,
    cards,
    coins,
    landmarks,
  } = player;

  const playerStatusClass = useMemo(() => (status === Status.ACTIVE ? 'player-view__status--green' : 'player-view__status--red'), [status]);

  return (
    <div className={clsx('player-view', className)}>
      <div className="player-view__info">
        <div className="player-view__headline">
          <div className="player-view__status-container">
            <div className={clsx('player-view__status', playerStatusClass)} />
          </div>
          <span className="player-view__coins-container">
            <span className="player-view__coins-background">
              <span className="player-view__coins">{coins}</span>
            </span>
          </span>
        </div>
        <p className="player-view__username">{username}</p>
      </div>
      <div className="player-view__landmarks">
        {landmarks.map((playerLandmark) => (
          <LandmarkView
            cardInfo={playerLandmark}
            size="xs"
          />
        ))}

      </div>
      <div className="player-view__cards" style={{ ['--cards-number' as string]: cards.length - 1 }}>
        { cards.map((card, cardIndex) => (
          <div className="player-view__card-container" style={{ ['--number' as string]: cardIndex }}>
            <CommonEstablishmentView
              cardInfo={card}
              key={card.name}
            />
            <CommonEstablishmentView
              className="player-view__show-card"
              cardInfo={card}
              size="lg"
              key={card.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
