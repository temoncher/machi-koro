import clsx from 'clsx';
import './DicePairView.css';
import React from 'react';

import { DiceCombination } from '../types/Dice';

import { DiceView } from './DiceView';

type DicePairViewProps = {
  className?: string;
  rolledDiceCombination: DiceCombination | undefined;
};

export const DicePairView: React.FC<DicePairViewProps> = (props) => {
  const [firstDice, secondDice] = props.rolledDiceCombination ?? [];

  return (
    <div className={clsx('dice-container', props.className)}>
      <DiceView
        className="dice-container__dice-view"
        rolledDice={firstDice}
      />
      <DiceView
        className="dice-container__dice-view"
        rolledDice={secondDice}
      />
    </div>
  );
};
