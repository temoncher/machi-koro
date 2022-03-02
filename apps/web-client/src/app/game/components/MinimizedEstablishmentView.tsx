import { Establishment } from '@machikoro/game-server-contracts';
import { Box, SxProps } from '@mui/material';

import { CardIconView } from './CardIconView';
import { CardNameWithEmblem } from './CardNameWithEmblem';
import { CoinView } from './CoinView';
import { cardTypeToColorMap } from './cardTypeToColorMap';
import notFoundSrc from './images/not-found.png';
import { tagToEmblemSrcMap } from './tagToEmblemSrcMap';

type MinimizedEstablishmentViewProps = {
  sx?: SxProps;
  establishment: Establishment;
  quantity?: number;
  onClick?: () => void;
};

export const MinimizedEstablishmentView: React.FC<MinimizedEstablishmentViewProps> = (props) => {
  const cardColor = cardTypeToColorMap[props.establishment.domain];
  const initials = props.establishment.name.split(' ').map((word) => word[0]?.toLocaleLowerCase()).join('');

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
        sx={{
          p: 0.75,
          width: '100%',
          height: '100%',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (theme) => theme.palette[cardColor].light,
        }}
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
          tagSrc={tagToEmblemSrcMap[props.establishment.tag]}
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
            src={props.establishment.imageSrc ?? notFoundSrc}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'space-between',
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
            type="gold"
          >
            {props.establishment.cost}
          </CoinView>
          {props.quantity && (
            <CardIconView
              sx={{
                minWidth: 15,
                width: 15,
                minHeight: 20,
                height: 20,
                fontSize: '0.75rem',
                borderWidth: 2,
              }}
            >
              {props.quantity}
            </CardIconView>
          )}
        </Box>
      </Box>
    </Box>
  );
};
