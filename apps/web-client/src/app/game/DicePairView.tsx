import clsx from 'clsx';
import './DicePairView.css';
import React, { memo } from 'react';

import { DiceCombination } from '../types';

import { DiceView } from './DiceView';

type DicePairViewProps = {
  className?: string;
  rolledDiceCombination: DiceCombination | undefined;
};

export const DicePairView: React.FC<DicePairViewProps> = memo(({
  className,
  rolledDiceCombination,
}: DicePairViewProps) => {
  const [firstDice, secondDice] = rolledDiceCombination ?? [];

  return (
    <div className={clsx('dice-container', className)}>

      <DiceView className="dice-container__dice-view" rolledDice={firstDice} />
      <DiceView className="dice-container__dice-view" rolledDice={secondDice} />
    </div>
  );
});
