import { Landmark, Establishment } from '@machikoro/game-server-contracts';
import { Box, SxProps, Typography } from '@mui/material';

import { CoinView } from './CoinView';
import { UnderConstructionBackdrop } from './UnderConstructionBackdrop';
import { cardTypeToColorMap } from './cardTypeToColorMap';

type CardNameWithTagProps = {
  sx?: SxProps;
  color: typeof cardTypeToColorMap[keyof typeof cardTypeToColorMap];
  tagSrc: string;
};

const CardNameWithEmblem: React.FC<CardNameWithTagProps> = (props) => (
  <Typography
    sx={{
      pb: 0.5,
      '&::before': {
        mr: 0.25,
        display: 'inline-block',
        verticalAlign: 'middle',
        height: 12,
        width: 12,
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

type MinimizedCardViewProps = {
  sx?: SxProps;
  cardInfo: Landmark | Establishment;
  quantity?: number;
  underConstruction?: boolean;
  onClick: () => void;
};

const MinimizedCardView: React.FC<MinimizedCardViewProps> = (props) => {
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
        <CardNameWithEmblem color={cardColor} tagSrc={props.cardInfo.tagSrc}>
          {initials}
        </CardNameWithEmblem>

        <Box
          sx={{
            p: 1,
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
            src={props.cardInfo.imageSrc}
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

type MinimizedLandmarkViewProps = Omit<MinimizedCardViewProps, 'cardInfo'> & {
  /* eslint-disable react/no-unused-prop-types */
  cardInfo: Landmark;
  underConstruction: boolean;
  onClick?: () => void;
  /* eslint-enable react/no-unused-prop-types */
};

export const MinimizedLandmarkView: React.FC<MinimizedLandmarkViewProps> = (props) => (
  <MinimizedCardView
    /* eslint-disable react/destructuring-assignment */
    sx={props.sx}
    cardInfo={props.cardInfo}
    underConstruction={props.underConstruction}
    onClick={props.onClick}
    /*  eslint-enable react/destructuring-assignment */
  />
);

type MinimizedCommonEstablishmentViewProps = Omit<MinimizedCardViewProps, 'cardInfo'> & {
  /* eslint-disable react/no-unused-prop-types */
  cardInfo: Establishment;
  quantity: number;
  onClick?: () => void;
  /* eslint-enable react/no-unused-prop-types */
};

export const MinimizedCommonEstablishmentView: React.FC<MinimizedCommonEstablishmentViewProps> = (props) => (
  <MinimizedCardView
    /* eslint-disable react/destructuring-assignment */
    sx={props.sx}
    cardInfo={props.cardInfo}
    quantity={props.quantity}
    onClick={props.onClick}
    /*  eslint-enable react/destructuring-assignment */
  />
);
