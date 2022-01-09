import { User } from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';

import profilePlaceholderImage from '../../assets/images/profile/profile-placeholder.png';

import './UserCard.css';

type UserCardProps = {
  user: User;
  isHighlighted: boolean;
};

export const UserCard: React.FC<UserCardProps> = (props: UserCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx({
        /* eslint-disable @typescript-eslint/naming-convention */
        'user-card__container': true,
        'user-card__container--highlighted': props.isHighlighted,
        /* eslint-enable @typescript-eslint/naming-convention */
      })}
    >
      <div className="user-card-header">
        <div className="user-card-header__img">
          <img alt="user avatar" src={profilePlaceholderImage} />
        </div>
        <div className="user-card-header__name">{props.user.username}</div>
      </div>
      <div className="user-card-header__login-type">
        {t('lobby.guestCardSubtitleText')}
      </div>
    </div>
  );
};
