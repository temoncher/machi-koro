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

const compareByActivation = (firstEstablishment: Establishment | undefined, secondEstablishment: Establishment | undefined) => {
  const firstEstablishmentActivation = firstEstablishment?.activation[0] ?? 0;
  const secondEstablishmentActivation = secondEstablishment?.activation[0] ?? 0;

  if (firstEstablishmentActivation > secondEstablishmentActivation) return 1;

  if (firstEstablishmentActivation < secondEstablishmentActivation) return -1;

  return 0;
};

export const EstablishmentsShopView: React.FC<EstablishmentsShopViewProps> = (props) => (
  <Box
    sx={{
      p: 2,
      minWidth: 240,
      display: 'flex',
      flexWrap: 'wrap',
      borderRadius: 2,
      gap: 2,
      overflow: 'auto',
      bgcolor: (theme) => theme.palette.primary.light,
      ...props.sx,
    }}
  >
    {Object.entries(props.shop)
      .map(([establishmentId, quantity]) => [props.establishments[establishmentId as EstablishmentId], quantity] as const)
      .sort(([firstEstablishment], [secondEstablishment]) => compareByActivation(firstEstablishment, secondEstablishment))
      .map(([establishment, quantity]) => {
        if (!establishment) return null;

        return (
          <CommonEstablishmentView
            key={`Shop_${establishment.name}`}
            establishment={establishment}
            quantity={quantity}
            onClick={() => {
              props.onEstablishmentClick(establishment.establishmentId);
            }}
          />
        );
      })}
  </Box>
);
