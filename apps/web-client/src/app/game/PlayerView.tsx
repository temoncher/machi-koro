import clsx from 'clsx';
import './PlayerView.css';
import React, { memo } from 'react';

import { Landmark, CommonEstablishment } from '../types/types';

import { CommonEstablishmentView, LandmarkView } from './CardView';

type PlayerViewProps = {
  className?: string;
  username: string;
  status: boolean;
  cards: CommonEstablishment[];
  coins: number;
  landmarks: Landmark[];
};

export const PlayerView: React.FC<PlayerViewProps> = memo(({
  className, username, status, cards, coins, landmarks,
}: PlayerViewProps) => (
  <div className={clsx('player-view', className)}>
    <div className="player-view__info">
      <div className="player-view__headline">
        <div className="player-view__status-container">
          <div className={clsx({
            /* eslint-disable @typescript-eslint/naming-convention */

            'player-view__status': true,
            'player-view__status--red': !status,
            'player-view__status--green': status,

            /* eslint-enable @typescript-eslint/naming-convention */
          })}
          />
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
          />
          <CommonEstablishmentView
            className="player-view__show-card"
            cardInfo={card}
            size="lg"
          />
        </div>
      ))}
    </div>
  </div>
));
