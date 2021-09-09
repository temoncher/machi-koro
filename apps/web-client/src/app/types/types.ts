type LandmarkType = 'landmark';

type CommonEstablishmentType = 'majorEstablishment' | 'industry' | 'shopsFactoriesAndMarket' | 'restaurant';

export enum Status {
  ACTIVE = 'active',
  NOT_ACTIVE = 'notActive',
}

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

export type Player = {
  username: string;
  status: Status;
  cards: CommonEstablishment[];
  coins: number;
  landmarks: Landmark[];
};

export enum Dice {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
}

export type DiceCombination = [Dice, Dice | undefined];
