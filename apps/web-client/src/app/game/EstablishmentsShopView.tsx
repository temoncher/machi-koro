import './EstablishmentsShopView.css';
import clsx from 'clsx';
import React, { memo } from 'react';

import { CommonEstablishment } from '../types';

import { CommonEstablishmentView } from './CardView';

type EstablishmentsShopViewProps = {
  className?: string;
  establishmentsShop: CommonEstablishment[];
};

export const EstablishmentsShopView: React.FC<EstablishmentsShopViewProps> = memo(({
  className,
  establishmentsShop,
}: EstablishmentsShopViewProps) => (
  <div className={clsx('activation-cards', className)}>
    {establishmentsShop.map((establishment) => <CommonEstablishmentView cardInfo={establishment} size="lg" key={establishment.name} />)}
  </div>
));
