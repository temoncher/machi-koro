/* eslint-disable @typescript-eslint/naming-convention */
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';

import profilePlaceholderImage from '../../assets/images/profile/profile-placeholder.png';

import './PlayerCard.css';

export type Player = {
  id: string;
  name: string;
  status: 'active' | 'notActive';
  loginType: 'guest';
};

type PlayerCardProps = {
  player: Player;
  isHighlighted: boolean;
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isHighlighted }: PlayerCardProps) => {
  const { t } = useTranslation();

  return (
    <div className={clsx({
      'player-card__container': true,
      'player-card__container--highlighted': isHighlighted,
    })}
    >
      <div className="player-card-header">
        <div className="player-card-header__img">
          <img alt="user avatar" src={profilePlaceholderImage} />
        </div>
        <div className="player-card-header__name">
          {player.name}
        </div>
      </div>
      <div className="player-card-header__login-type">
        {t('lobby.guestCardSubtitleText')}
      </div>
    </div>
  );
};
