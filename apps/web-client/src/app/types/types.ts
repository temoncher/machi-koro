type LandmarkType = 'landmark';

type CommonEstablishmentType = 'majorEstablishment' | 'industry' | 'shopsFactoriesAndMarket' | 'restaurant';

export type EstablishmentCommonFields = {
  name: string;
  tagSrc: string;
  establishmentImageSrc: string;
  descriptionText: string;
};

export type Landmark = EstablishmentCommonFields & {
  type: LandmarkType;
  buildCost: number;
  underConstruction: boolean;
};

export type CommonEstablishment = EstablishmentCommonFields & {
  activationDice?: [number, number?];
  type: CommonEstablishmentType;
  count: number;
  buildCost?: number;
};

export type Establishment = Landmark | CommonEstablishment;
