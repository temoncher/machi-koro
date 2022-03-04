import { Landmark } from '@machikoro/game-server-contracts';
import { Box, SxProps, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import { CardNameWithEmblem } from './CardNameWithEmblem';
import { CoinView } from './CoinView';
import { UnderConstructionBackdrop } from './UnderConstructionBackdrop';
import { cardTypeToColorMap } from './cardTypeToColorMap';
import notFoundSrc from './images/not-found.png';
import { tagToEmblemSrcMap } from './tagToEmblemSrcMap';

const maxTitleLength = 16;
const maxDescritionLength = 45;

type LandmarkViewProps = {
  sx?: SxProps;
  className?: string;
  underConstruction: boolean;
  landmark: Landmark;
  onClick?: () => void;
};

export const LandmarkView: React.FC<LandmarkViewProps> = (props) => {
  const {
    name,
    imageSrc,
    cost,
    descriptionText,
    domain,
  } = props.landmark;

  const cardColor = useMemo(() => cardTypeToColorMap[domain], [domain]);

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
        sx={[
          {
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
          },
          !!props.underConstruction && {
            filter: 'grayscale(100%)',
          },
        ]}
      >
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

        <Box
          sx={{
            height: '20%',
            minHeight: '20%',
            maxHeight: '20%',
          }}
        >
          <CardNameWithEmblem
            sx={{ fontSize: Math.min(20, 20 * (maxTitleLength / name.length)) }}
            color={cardColor}
            tagSrc={tagToEmblemSrcMap.landmark}
          >
            {name}
          </CardNameWithEmblem>
        </Box>

        <Box
          sx={{
            p: 1,
            minHeight: '55%',
            height: '55%',
            maxHeight: '55%',
            display: 'flex',
            justifyContent: 'center',
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
              type="bronze"
            >
              {cost}
            </CoinView>
          )}
        </Box>
      </Box>

      {props.underConstruction && (<UnderConstructionBackdrop />)}
    </Box>
  );
};
