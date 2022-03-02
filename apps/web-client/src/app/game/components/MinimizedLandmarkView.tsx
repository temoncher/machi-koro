import { Landmark } from '@machikoro/game-server-contracts';
import { Box, SxProps } from '@mui/material';

import { CardNameWithEmblem } from './CardNameWithEmblem';
import { CoinView } from './CoinView';
import { UnderConstructionBackdrop } from './UnderConstructionBackdrop';
import { cardTypeToColorMap } from './cardTypeToColorMap';
import notFoundSrc from './images/not-found.png';
import { tagToEmblemSrcMap } from './tagToEmblemSrcMap';

type MinimizedLandmarkViewProps = {
  sx?: SxProps;
  underConstruction: boolean;
  landmark: Landmark;
  onClick?: () => void;
};

export const MinimizedLandmarkView: React.FC<MinimizedLandmarkViewProps> = (props) => {
  const cardColor = cardTypeToColorMap[props.landmark.domain];
  const initials = props.landmark.name.split(' ').map((word) => word[0]?.toLocaleLowerCase()).join('');

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
            p: 0.75,
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
          sx={{
            fontSize: '1.25rem',
          }}
          emblemSx={{
            mr: 0.5,
            height: 20,
            width: 20,
          }}
          color={cardColor}
          tagSrc={tagToEmblemSrcMap.landmark}
        >
          {initials}
        </CardNameWithEmblem>

        <Box
          sx={{
            py: 0.75,
            minHeight: '60%',
            height: '60%',
            maxHeight: '60%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            style={{ objectFit: 'contain' }}
            alt="card"
            src={props.landmark.imageSrc ?? notFoundSrc}
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
              minWidth: 20,
              width: 20,
              minHeight: 20,
              height: 20,
              fontSize: '0.75rem',
              borderWidth: 2,
            }}
            type="bronze"
          >
            {props.landmark.cost}
          </CoinView>
        </Box>
      </Box>
      {props.underConstruction && (<UnderConstructionBackdrop />)}
    </Box>
  );
};
