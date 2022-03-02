import { Landmark } from '@machikoro/game-server-contracts';
import { Box, SxProps } from '@mui/material';

import { CardNameWithEmblem } from './CardNameWithEmblem';
import { CoinView } from './CoinView';
import { UnderConstructionBackdrop } from './UnderConstructionBackdrop';
import { cardTypeToColorMap } from './cardTypeToColorMap';
import defaultImageSrc from './images/MachiCoro_Bakery_TP_256px.png';
import { tagToEmblemSrcMap } from './tagToEmblemSrcMap';

type MinimizedLandmarkViewProps = {
  sx?: SxProps;
  underConstruction: boolean;
  cardInfo: Landmark;
  onClick?: () => void;
};

export const MinimizedLandmarkView: React.FC<MinimizedLandmarkViewProps> = (props) => {
  const cardColor = cardTypeToColorMap[props.cardInfo.domain];
  const initials = props.cardInfo.name.split(' ').map((word) => word[0]?.toLocaleLowerCase()).join('');

  return (
    <Box
      sx={{
        position: 'relative',
        minWidth: 72,
        width: 72,
        maxWidth: 72,
        minHeight: 108,
        height: 108,
        maxHeight: 108,
        overflow: 'hidden',
        ...props.sx,
      }}
    >
      <Box
        sx={[
          {
            p: 1,
            width: '100%',
            height: '100%',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: (theme) => theme.palette[cardColor].light,
          },
          !!props.underConstruction && {
            filter: 'grayscale(100%)',
          },
        ]}
      >
        <CardNameWithEmblem
          emblemSx={{
            mr: 0.25,
            height: 12,
            width: 12,
          }}
          color={cardColor}
          tagSrc={tagToEmblemSrcMap.landmark}
        >
          {initials}
        </CardNameWithEmblem>

        <Box
          sx={{
            p: 1,
            minHeight: '70%',
            height: '70%',
            maxHeight: '70%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            style={{ objectFit: 'contain' }}
            alt="card"
            src={props.cardInfo.imageSrc ?? defaultImageSrc}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <CoinView
            sx={{
              minWidth: 16,
              width: 16,
              minHeight: 16,
              height: 16,
              fontSize: 8,
            }}
            type="bronze"
          >
            {props.cardInfo.cost}
          </CoinView>
        </Box>
      </Box>
      {props.underConstruction && (<UnderConstructionBackdrop />)}
    </Box>
  );
};
