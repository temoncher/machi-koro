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
  onClick?: () => void;
  cardInfo: Landmark;
  underConstruction: boolean;
};

export const LandmarkView: React.FC<LandmarkViewProps> = (props) => {
  const {
    name,
    imageSrc,
    cost,
    descriptionText,
    domain,
  } = props.cardInfo;

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
        sx={[
          {
            p: 1.5,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            backgroundSize: 'cover',
            borderRadius: 2,
            bgcolor: (theme) => theme.palette[cardColor].light,
          },
          !!props.underConstruction && {
            filter: 'grayscale(100%)',
          },
        ]}
      >
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
              type="gold"
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
