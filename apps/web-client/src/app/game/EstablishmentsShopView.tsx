import { Establishment, EstablishmentId } from '@machikoro/game-server-contracts';
import { Box, SxProps } from '@mui/material';
import React from 'react';

import { CommonEstablishmentView } from './components/CommonEstablishmentView';

type EstablishmentsShopViewProps = {
  sx?: SxProps;
  establishments: Record<EstablishmentId, Establishment>;
  shop: Record<EstablishmentId, number>;
  onEstablishmentClick: (establishmentId: EstablishmentId) => void;
};

export const EstablishmentsShopView: React.FC<EstablishmentsShopViewProps> = (props) => (
  <Box
    sx={{
      p: 2,
      minWidth: 240,
      display: 'flex',
      borderRadius: 2,
      bgcolor: (theme) => theme.palette.primary.light,
      '> *': {
        mr: 2,
      },
      ...props.sx,
    }}
  >
    {Object.entries(props.shop).map(([establishmentId, quantity]) => {
      const establishment = props.establishments[establishmentId as EstablishmentId];

      if (!establishment) return null;

      return (
        <CommonEstablishmentView
          key={establishment.name}
          cardInfo={establishment}
          quantity={quantity}
          onClick={() => {
            props.onEstablishmentClick(establishmentId as EstablishmentId);
          }}
        />
      );
    })}
  </Box>
);
