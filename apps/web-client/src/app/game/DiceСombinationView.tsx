import { Box, SxProps } from '@mui/material';
import React, { useMemo } from 'react';

import { DiceCombination, Dice } from '../types/Dice';

import './DiceCombinationView.css';

type DiceViewProps = {
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

const DiceView: React.FC<DiceViewProps> = ({ rolledDice }) => {
  const diceClass = useMemo(() => (rolledDice
    ? diceCountToClass[rolledDice]
    : 'dice--disable'), [rolledDice]);

  return (
    <Box
      sx={{
        width: 64,
        height: 64,
        position: 'relative',
        borderWidth: 4,
        borderRadius: 4,
        borderStyle: 'solid',
        borderColor: (theme) => theme.palette.grey[400],
        bgcolor: (theme) => theme.palette.common.white,
      }}
      className={diceClass}
    >
      {rolledDice && Array(rolledDice)
        .fill(0)
        // eslint-disable-next-line react/no-array-index-key
        .map((zero, dotIndex) => (
          <Box
            key={String(dotIndex)}
            sx={{
              width: 12,
              height: 12,
              position: 'absolute',
              bgcolor: (theme) => theme.palette.common.black,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
    </Box>
  );
};

type DicePairViewProps = {
  sx?: SxProps;
  rolledDiceCombination: DiceCombination | undefined;
};

export const DiceCombinationView: React.FC<DicePairViewProps> = (props) => {
  const [firstDice, secondDice] = props.rolledDiceCombination ?? [];

  return (
    <Box
      sx={{
        p: 2,
        '> :not(:first-child)': {
          mt: 2,
        },
        ...props.sx,
      }}
    >
      <DiceView rolledDice={firstDice} />
      <DiceView rolledDice={secondDice} />
    </Box>
  );
};
