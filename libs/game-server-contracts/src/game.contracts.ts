import { z } from 'zod';

import { UserId, User } from './user.model';

const MAX_LENGTH_LOBBY_ID = 36;

export type CommonEstablishmentDomain = 'majorEstablishment' | 'industry' | 'shopsFactoriesAndMarket' | 'restaurant';

export type CommonEstablishmentType = 'wheat' | 'livestock' | 'box' | 'cup' | 'gear' | 'enterprise' | 'apple' | 'establishment';

export type LandmarkId = string;

export type EstablishmentId = string;

export type LandmarkDomain = 'landmark';

export const tagToUrlMap: Record<CommonEstablishmentType | LandmarkDomain, string> = {
  wheat: 'http://localhost:3333/static/icons/wheat.png',
  livestock: 'http://localhost:3333/static/icons/cow.png',
  box: 'http://localhost:3333/static/icons/shop.png',
  cup: 'http://localhost:3333/static/icons/cup.png',
  gear: 'http://localhost:3333/static/icons/gear.png',
  enterprise: 'http://localhost:3333/static/icons/factory.png',
  apple: 'http://localhost:3333/static/icons/fruit.png',
  establishment: 'http://localhost:3333/static/icons/major.png',
  landmark: 'http://localhost:3333/static/icons/landmark-icon.png',
};

export type CommonEstablishmentFields = {
  name: string;
  tagSrc: string;
  imageSrc: string;
  descriptionText: string;
  cost: number;
};

export type Landmark = CommonEstablishmentFields & {
  landmarkId: LandmarkId;
  domain: LandmarkDomain;
};

export type Establishment = CommonEstablishmentFields & {
  establishmentId: EstablishmentId;
  domain: CommonEstablishmentDomain;
  tag: CommonEstablishmentType;
  activation: number[];
};

export type EstablishmentApplyEffect = Record<EstablishmentId, (context: GameContext) => GameContext>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type GameId = string & { readonly GAME_ID: unique symbol };

export type Player = { userId: UserId };

export enum PlayerConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ABANDONED = 'ABANDONED',
}

export type PlayerConnectionStatusesMap = Record<UserId, PlayerConnectionStatus>;

export type Game = {
  gameId: GameId;
  hostId: UserId;
  players: Record<UserId, User>;
  playersConnectionStatuses: PlayerConnectionStatusesMap;
};

export type GameContext = {
  gameEstablishments: Record<EstablishmentId, Establishment>;
  shop: Record<EstablishmentId, number>;
  gameLandmarks: Record<LandmarkId, Landmark>;
  activePlayerId: UserId;
  players: Player[];
  establishments: Record<UserId, Record<EstablishmentId, number>>;
  coins: Record<UserId, number>;
  landmarks: Record<UserId, Record<LandmarkId, boolean>>;
  rollDiceResult: number;
  winnerId: UserId | undefined;
};

export type ApplyEffects = (
  establishmentId: EstablishmentId,
  income: number,
  activetedEstablishmentType?: CommonEstablishmentType
) => (context: GameContext) => GameContext;

export type EstablishmentEffect = (context: GameContext) => GameContext;

export const allGameLandmarks: Record<LandmarkId, Landmark> = {
  trainStation: {
    landmarkId: 'trainStation',
    domain: 'landmark',
    name: 'Train Station',
    cost: 4,
    tagSrc: tagToUrlMap.landmark,
    imageSrc: 'http://localhost:3333/static/landmark-images/train-station.png',
    descriptionText: 'Roll 2 dice at the same time.',
  },
  shoppingMall: {
    landmarkId: 'shoppingMall',
    domain: 'landmark',
    name: 'Shopping Mall',
    cost: 10,
    tagSrc: tagToUrlMap.landmark,
    imageSrc: 'http://localhost:3333/static/landmark-images/shopping-mall.png',
    descriptionText: 'Increase the number of coins you get for your Café and Restaurant by 1.',
  },
  amusementPark: {
    landmarkId: 'amusementPark',
    domain: 'landmark',
    name: 'Amusement Park',
    cost: 16,
    tagSrc: tagToUrlMap.landmark,
    imageSrc: 'http://localhost:3333/static/landmark-images/amusement-park.png',
    descriptionText: 'Take another turn if you roll doubles.',
  },
  radioTower: {
    landmarkId: 'radioTower',
    domain: 'landmark',
    name: 'Radio tower',
    cost: 22,
    tagSrc: tagToUrlMap.landmark,
    imageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
    descriptionText: 'You may re-roll your dice once each turn.',
  },
};

export const allGameEstablishments: Record<EstablishmentId, Establishment> = {
  wheatField: {
    establishmentId: 'wheatField',
    domain: 'industry',
    tag: 'wheat',
    name: 'Wheat field',
    cost: 1,
    activation: [1],
    tagSrc: tagToUrlMap.wheat,
    imageSrc: 'http://localhost:3333/static/establishment-images/flower-garden.png',
    descriptionText: 'Receive 1 coin from the bank regardless of whose turn it is.',
  },
  livestockFarm: {
    establishmentId: 'livestockFarm',
    domain: 'industry',
    tag: 'livestock',
    name: 'Livestock Farm',
    cost: 1,
    activation: [2],
    tagSrc: tagToUrlMap.livestock,
    imageSrc: 'http://localhost:3333/static/establishment-images/ranch.png',
    descriptionText: 'Receive 1 coin from the bank regardless of whose turn it is.',
  },
  bakery: {
    establishmentId: 'bakery',
    domain: 'shopsFactoriesAndMarket',
    tag: 'box',
    name: 'Bakery',
    cost: 1,
    activation: [2, 3],
    tagSrc: tagToUrlMap.box,
    imageSrc: 'http://localhost:3333/static/establishment-images/bakery.png',
    descriptionText: 'Receive 1 coin from the bank if it’s your turn.',
  },
  cafe: {
    establishmentId: 'cafe',
    domain: 'restaurant',
    tag: 'cup',
    name: 'Cafe',
    cost: 2,
    activation: [3],
    tagSrc: tagToUrlMap.cup,
    imageSrc: 'http://localhost:3333/static/establishment-images/cafe.png',
    descriptionText: 'Receive 1 coin from any player who rolls this number.',
  },
  convenienceStore: {
    establishmentId: 'convenienceStore',
    domain: 'shopsFactoriesAndMarket',
    tag: 'box',
    name: 'Convenience Store',
    cost: 2,
    activation: [4],
    tagSrc: tagToUrlMap.box,
    imageSrc: 'http://localhost:3333/static/establishment-images/shop.png',
    descriptionText: 'Receive 3 coins from the bank if it’s your turn.',
  },
  forest: {
    establishmentId: 'forest',
    domain: 'industry',
    tag: 'gear',
    name: 'Forest',
    cost: 3,
    activation: [5],
    tagSrc: tagToUrlMap.gear,
    imageSrc: 'http://localhost:3333/static/establishment-images/forest.png',
    descriptionText: 'Receive 1 coin from the bank regardless of whose turn it is.',
  },
  stadium: {
    establishmentId: 'stadium',
    domain: 'majorEstablishment',
    tag: 'establishment',
    name: 'Stadium',
    cost: 6,
    activation: [6],
    tagSrc: tagToUrlMap.establishment,
    imageSrc: 'http://localhost:3333/static/major-establishment-images/stadium.png',
    descriptionText: 'Receive 2 coins from each player if it’s your turn.',
  },
  TvStation: {
    establishmentId: 'TvStation',
    domain: 'majorEstablishment',
    tag: 'establishment',
    name: 'TV Station',
    cost: 7,
    activation: [6],
    tagSrc: tagToUrlMap.establishment,
    imageSrc: 'http://localhost:3333/static/major-establishment-images/publisher.png',
    descriptionText: 'Receive 5 coins from one player of your choice if it’s your turn.',
  },
  businessComplex: {
    establishmentId: 'businessComplex',
    domain: 'majorEstablishment',
    tag: 'establishment',
    name: 'Business Complex',
    cost: 8,
    activation: [6],
    tagSrc: tagToUrlMap.establishment,
    imageSrc: 'http://localhost:3333/static/major-establishment-images/buisness-center.png',
    descriptionText: 'You may exchange one non-major establishment card with any other player if it’s your turn.',
  },
  cheeseFactory: {
    establishmentId: 'cheeseFactory',
    domain: 'shopsFactoriesAndMarket',
    tag: 'enterprise',
    name: 'Cheese Factory',
    cost: 5,
    activation: [7],
    tagSrc: tagToUrlMap.enterprise,
    imageSrc: 'http://localhost:3333/static/establishment-images/cheese-factory.png',
    descriptionText: 'Receive 3 coins from the bank for every Livestock Farm you have if it’s your turn.',
  },
  furnitureFactory: {
    establishmentId: 'furnitureFactory',
    domain: 'shopsFactoriesAndMarket',
    tag: 'enterprise',
    name: 'Furniture Factory',
    cost: 3,
    activation: [8],
    tagSrc: tagToUrlMap.enterprise,
    imageSrc: 'http://localhost:3333/static/establishment-images/furniture-factory.png',
    descriptionText: 'Receive 3 coins from the bank for every Forest you have if it’s your turn.',
  },
  mine: {
    establishmentId: 'mine',
    domain: 'industry',
    tag: 'gear',
    name: 'Mine',
    cost: 6,
    activation: [9],
    tagSrc: tagToUrlMap.gear,
    imageSrc: 'http://localhost:3333/static/establishment-images/mine.png',
    descriptionText: 'Receive 5 coins from the bank regardless of whose turn it is.',
  },
  restaurant: {
    establishmentId: 'restaurant',
    domain: 'restaurant',
    tag: 'cup',
    name: 'Restaurant',
    cost: 3,
    activation: [9, 10],
    tagSrc: tagToUrlMap.cup,
    imageSrc: 'http://localhost:3333/static/establishment-images/restaurant.png',
    descriptionText: 'Receive 2 coins from any player who rolls these numbers.',
  },
  appleOrchard: {
    establishmentId: 'appleOrchard',
    domain: 'industry',
    tag: 'wheat',
    name: 'Apple Orchard',
    cost: 3,
    activation: [10],
    tagSrc: tagToUrlMap.wheat,
    imageSrc: 'http://localhost:3333/static/establishment-images/apple-orchard.png',
    descriptionText: 'Receive 3 coins from the bank regardless of whose turn it is.',
  },
  produceMarket: {
    establishmentId: 'produceMarket',
    domain: 'shopsFactoriesAndMarket',
    tag: 'apple',
    name: 'Produce Market',
    cost: 2,
    activation: [11, 12],
    tagSrc: tagToUrlMap.apple,
    imageSrc: 'http://localhost:3333/static/establishment-images/convenience-store.png',
    descriptionText: "Receive 2 coins from the bank for every 'wheat' card you have if it’s your turn.",
  },
};

export const createGameRequestBodySchema = z.object({
  lobbyId: z
    .string()
    .max(MAX_LENGTH_LOBBY_ID, {
      message: `'lobbyId' should be at most ${String(MAX_LENGTH_LOBBY_ID)} characters long`,
    }),
});

export type CreateGameRequestBody = z.infer<typeof createGameRequestBodySchema>;

export type CreateGameResponse = {
  gameId: GameId;
};
