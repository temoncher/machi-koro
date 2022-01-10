import './EstablishmentsShopView.css';
import { Establishment, EstablishmentId } from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import React from 'react';

import { CommonEstablishmentView } from './CardView';

type EstablishmentsShopViewProps = {
  className?: string;
  establishments: Record<EstablishmentId, Establishment>;
  shop: Record<EstablishmentId, number>;
  onEstablishmentClick: (establishmentId: EstablishmentId) => void;
};

export const EstablishmentsShopView: React.FC<EstablishmentsShopViewProps> = (props) => (
  <div className={clsx('activation-cards', props.className)}>
    {Object.entries(props.shop).map(([establishmentId, quantity]) => {
      const establishment = props.establishments[establishmentId];

      if (!establishment) return null;

      return (
        <CommonEstablishmentView
          key={establishment.name}
          cardInfo={establishment}
          quantity={quantity}
          size="lg"
          onClick={() => {
            props.onEstablishmentClick(establishmentId);
          }}
        />
      );
    })}
  </div>
);
