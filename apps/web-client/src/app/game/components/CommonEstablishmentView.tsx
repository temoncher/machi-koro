import { Establishment } from '@machikoro/game-server-contracts';
import { Box, SxProps, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import { UrlUtils } from '../../utils/url.utils';

import { CoinView } from './CoinView';
import { cardTypeToColorMap } from './cardTypeToColorMap';

type CardIconViewProps = {
  sx?: SxProps;
};

const CardIconView: React.FC<CardIconViewProps> = (props) => (
  <Box
    sx={{
      width: 24,
      height: 32,
      textAlign: 'center',
      borderWidth: 4,
      borderRadius: 1,
      borderStyle: 'solid',
      borderColor: (theme) => theme.palette.grey[400],
      bgcolor: (theme) => theme.palette.grey[200],
      ...props.sx,
    }}
  >
    {props.children}
  </Box>
);

type CardNameWithTagProps = {
  sx?: SxProps;
  color: typeof cardTypeToColorMap[keyof typeof cardTypeToColorMap];
  tagSrc: string;
};

const CardNameWithEmblem: React.FC<CardNameWithTagProps> = (props) => (
  <Typography
    sx={{
      pb: 1,
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
  cardInfo: Establishment;
  quantity?: number;
  onClick?: () => void;
};

export const CommonEstablishmentView: React.FC<CommonEstablishmentViewProps> = (props) => {
  const {
    activation,
    name,
    tagSrc,
    imageSrc,
    cost,
    descriptionText,
    domain,
  } = props.cardInfo;

  const activationDiceRange = useMemo((): string => activation.join('-'), [activation]);
  const cardColor = useMemo(() => cardTypeToColorMap[domain], [domain]);

  return (
    <Box
      component="article"
      sx={{
        position: 'relative',
        minWidth: 200,
        width: 200,
        maxWidth: 200,
        minHeight: 300,
        height: 300,
        maxHeight: 300,
        overflow: 'hidden',
        ...props.sx,
      }}
      className={props.className}
      onClick={props.onClick}
      onKeyDown={props.onClick}
    >
      <Box
        sx={{
          p: 1.5,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          backgroundSize: 'cover',
          borderRadius: 2,
          bgcolor: (theme) => theme.palette[cardColor].light,
        }}
        style={{ backgroundImage: `url(${UrlUtils.getBackgroundImageCard(cardColor)}` }}
      >
        <Box sx={{ position: 'relative ' }}>
          {props.quantity && (<CardIconView sx={{ position: 'absolute' }}>{props.quantity}</CardIconView>)}
          <Typography
            pb={3}
            fontFamily="lithos"
            textAlign="center"
            fontSize={24}
            lineHeight={0.8}
            color={(theme) => theme.palette.common.white}
          >
            {activationDiceRange}
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
          <CardNameWithEmblem sx={{ fontSize: Math.min(20, 20 * (maxTitleLength / name.length)) }} color={cardColor} tagSrc={tagSrc}>
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
          }}
        >
          <img
            style={{ objectFit: 'contain' }}
            alt="card"
            src={imageSrc}
          />
        </Box>

        <Box
          sx={{
            minHeight: '25%',
            height: '25%',
            maxHeight: '25%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
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
        </Box>
      </Box>
    </Box>
  );
};
