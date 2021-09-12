import './DiceView.css';
import clsx from 'clsx';
import React, { memo, useMemo } from 'react';

import { Dice } from '../types';

type DiceViewProps = {
  className?: string;
  rolledDice: Dice | undefined;
};

const diceCountToClass = {
  [Dice.ONE]: 'dice--one',
  [Dice.TWO]: 'dice--two',
  [Dice.THREE]: 'dice--three',
  [Dice.FOUR]: 'dice--four',
  [Dice.FIVE]: 'dice--five',
  [Dice.SIX]: 'dice--six',
} as const;

export const DiceView: React.FC<DiceViewProps> = memo(({
  className,
  rolledDice,
}: DiceViewProps) => {
  const diceClass = useMemo(() => (rolledDice
    ? diceCountToClass[rolledDice as keyof typeof diceCountToClass]
    : 'dice--disable'), [rolledDice]);

  return (
    <div className={clsx('dice', diceClass, className)}>
      {rolledDice && Array(rolledDice).fill(0)
        // eslint-disable-next-line react/no-array-index-key
        .map((rolledDiceItem, index) => <div className="dice__dot" key={index} />)}

    </div>
  );
});
