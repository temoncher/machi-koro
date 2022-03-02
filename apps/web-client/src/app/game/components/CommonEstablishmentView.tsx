import { Establishment } from '@machikoro/game-server-contracts';
import { Box, SxProps, Typography } from '@mui/material';
import React from 'react';

import { CardIconView } from './CardIconView';
import { CoinView } from './CoinView';
import { cardTypeToColorMap } from './cardTypeToColorMap';
import notFoundSrc from './images/not-found.png';
import { tagToEmblemSrcMap } from './tagToEmblemSrcMap';

type CardNameWithEmblemProps = {
  sx?: SxProps;
  color: typeof cardTypeToColorMap[keyof typeof cardTypeToColorMap];
  tagSrc: string;
};

const CardNameWithEmblem: React.FC<CardNameWithEmblemProps> = (props) => (
  <Typography
    sx={{
      '&::before': {
        mr: 1,
        display: 'inline-block',
        verticalAlign: 'middle',
        height: 24,
        width: 24,
        content: '""',
        backgroundSize: '100%',
        backgroundImage: `url('${props.tagSrc}')`,
      },
      ...props.sx,
    }}
    fontFamily="lithos"
    fontWeight="bold"
    color={(theme) => theme.palette[props.color].dark}
    textAlign="center"
    lineHeight={0.8}
  >
    {props.children}
  </Typography>
);

const maxTitleLength = 16;
const maxDescritionLength = 45;

type CommonEstablishmentViewProps = {
  sx?: SxProps;
  className?: string;
  establishment: Establishment;
  quantity?: number;
  onClick?: () => void;
};

export const CommonEstablishmentView: React.FC<CommonEstablishmentViewProps> = (props) => {
  const {
    activation,
    name,
    imageSrc,
    cost,
    descriptionText,
    domain,
    tag,
  } = props.establishment;

  const cardColor = cardTypeToColorMap[domain];

  return (
    <Box
      component="article"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minWidth: 200,
        width: 200,
        maxWidth: 200,
        minHeight: 300,
        height: 300,
        maxHeight: 300,
        ...props.sx,
      }}
      className={props.className}
      onClick={props.onClick}
      onKeyDown={props.onClick}
    >
      <Box
        sx={{
          p: 1.5,
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          backgroundSize: 'cover',
          borderRadius: 2,
          bgcolor: (theme) => theme.palette.backgroundBlue.main,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
            '> svg': {
              position: 'relative',
              display: 'block',
              widht: '100%',
              height: 64,
            },
            '.light-fill': {
              fill: (theme) => theme.palette[cardColor].light,
            },
            '.main-fill': {
              fill: (theme) => theme.palette[cardColor].main,
            },
          }}
        >
          <svg width="100%" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120" preserveAspectRatio="none">
            <path className="light-fill" d="M0 0 L300 0 L300 120 C250 80 50 80 0 120 L0 0" />
            <path className="main-fill" d="M0 0 L300 0 L300 100 C250 70 50 70 0 100 L0 0" />
          </svg>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
            transform: 'rotate(180deg)',
            '> svg': {
              position: 'relative',
              display: 'block',
              widht: '100%',
              height: 80,
            },
            '.light-fill': {
              fill: (theme) => theme.palette[cardColor].light,
            },
            '.main-fill': {
              fill: (theme) => theme.palette[cardColor].main,
            },
          }}
        >
          {/* TODO: do the cool curves */}
          <svg width="100%" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120" preserveAspectRatio="none">
            <path className="light-fill" d="M0 0 L300 0 L300 120 L0 120 L0 0" />
            <path className="main-fill" d="M0 0 L300 0 L300 105 L0 105 L0 0" />
          </svg>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Typography
            pb={3}
            fontFamily="lithos"
            textAlign="center"
            fontSize={24}
            lineHeight={0.8}
            color={(theme) => theme.palette.common.white}
          >
            {activation.join('-')}
          </Typography>
        </Box>

        <Box
          sx={{
            height: '15%',
            minHeight: '15%',
            maxHeight: '15%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardNameWithEmblem
            sx={{
              fontSize: Math.min(20, 20 * (maxTitleLength / name.length)),
            }}
            color={cardColor}
            tagSrc={tagToEmblemSrcMap[tag]}
          >
            {name}
          </CardNameWithEmblem>
        </Box>

        <Box
          sx={{
            p: 1,
            minHeight: '45%',
            height: '45%',
            maxHeight: '45%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <img
            style={{ objectFit: 'contain' }}
            alt="card"
            src={imageSrc ?? notFoundSrc}
          />
        </Box>

        <Box
          sx={{
            position: 'relative',
            minHeight: '25%',
            height: '25%',
            maxHeight: '25%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            px={1}
            fontSize={Math.min(14, 14 * (maxDescritionLength / descriptionText.length))}
            textAlign="center"
            color={(theme) => theme.palette.common.white}
          >
            {descriptionText}
          </Typography>

          {/* TODO: resolve problem with text behind the coin */}
          {cost && (
            <CoinView
              sx={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                fontSize: 16,
                minWidth: 32,
                width: 32,
                minHeight: 32,
                height: 32,
              }}
              type="gold"
            >
              {cost}
            </CoinView>
          )}

          {props.quantity && (<CardIconView sx={{ position: 'absolute', bottom: 0, right: 0 }}>{props.quantity}</CardIconView>)}
        </Box>
      </Box>
    </Box>
  );
};
