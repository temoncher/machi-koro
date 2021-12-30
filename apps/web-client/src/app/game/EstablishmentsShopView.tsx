import './EstablishmentsShopView.css';
import { Establishment, EstablishmentId } from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import React, { memo } from 'react';

import { CommonEstablishmentView } from './CardView';

type EstablishmentsShopViewProps = {
  className?: string;
  establishments: Record<EstablishmentId, Establishment>;
  shop: Record<EstablishmentId, number>;
  onEstablishmentClick: (establishmentId: string) => void;
};

export const EstablishmentsShopView: React.FC<EstablishmentsShopViewProps> = memo(
  (establishmentsShopViewProps: EstablishmentsShopViewProps) => (
    <div className={clsx('activation-cards', establishmentsShopViewProps.className)}>
      {Object.entries(establishmentsShopViewProps.shop).map(([establishmentId, quantity]) => {
        const establishment = establishmentsShopViewProps.establishments[establishmentId];

        return establishment && (
        <CommonEstablishmentView
          key={establishment.name}
          cardInfo={establishment}
          quantity={quantity}
          size="lg"
          onClick={() => { establishmentsShopViewProps.onEstablishmentClick(establishmentId); }}
        />
        );
      })}
    </div>
  ),
);
