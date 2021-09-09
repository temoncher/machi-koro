import clsx from 'clsx';
import './PlayersView.css';
import React, { memo } from 'react';

import { Player } from '../types/types';

import { PlayerView } from './PlayerView';

type PlayersViewProps = {
  className?: string;
  players: Player[];
};

export const PlayersView: React.FC<PlayersViewProps> = memo(({
  className,
  players,
}: PlayersViewProps) => (
  <div className={clsx('players', className)}>

    {players.map((player) => <PlayerView className="players__player-view" player={player} key={player.username} />)}
  </div>
));
