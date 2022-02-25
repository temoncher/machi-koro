import {
  LandmarkId,
  Landmark,
  CommonEstablishmentType,
  Establishment,
  EstablishmentId,
  LandmarkDomain,
} from './game.contracts';

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

export const landmarksIds = {
  trainStation: 'trainStation' as LandmarkId,
  shoppingMall: 'shoppingMall' as LandmarkId,
  amusementPark: 'amusementPark' as LandmarkId,
  radioTower: 'radioTower' as LandmarkId,
} as const;

export const allGameLandmarks: Record<LandmarkId, Landmark> = {
  [landmarksIds.trainStation]: {
    landmarkId: landmarksIds.trainStation,
    domain: 'landmark' as const,
    name: 'Train Station',
    cost: 4,
    tagSrc: tagToUrlMap.landmark,
    imageSrc: 'http://localhost:3333/static/landmark-images/train-station.png',
    descriptionText: 'Roll 2 dice at the same time.',
  },
  [landmarksIds.shoppingMall]: {
    landmarkId: landmarksIds.shoppingMall,
    domain: 'landmark' as const,
    name: 'Shopping Mall',
    cost: 10,
    tagSrc: tagToUrlMap.landmark,
    imageSrc: 'http://localhost:3333/static/landmark-images/shopping-mall.png',
    descriptionText: 'Increase the number of coins you get for your Café and Restaurant by 1.',
  },
  [landmarksIds.amusementPark]: {
    landmarkId: landmarksIds.amusementPark,
    domain: 'landmark' as const,
    name: 'Amusement Park',
    cost: 16,
    tagSrc: tagToUrlMap.landmark,
    imageSrc: 'http://localhost:3333/static/landmark-images/amusement-park.png',
    descriptionText: 'Take another turn if you roll doubles.',
  },
  [landmarksIds.radioTower]: {
    landmarkId: landmarksIds.radioTower,
    domain: 'landmark' as const,
    name: 'Radio tower',
    cost: 22,
    tagSrc: tagToUrlMap.landmark,
    imageSrc: 'http://localhost:3333/static/landmark-images/radio-tower.png',
    descriptionText: 'You may re-roll your dice once each turn.',
  },
};

export const establishmentsIds = {
  wheatField: 'wheatField' as EstablishmentId,
  livestockFarm: 'livestockFarm' as EstablishmentId,
  bakery: 'bakery' as EstablishmentId,
  cafe: 'cafe' as EstablishmentId,
  convenienceStore: 'convenienceStore' as EstablishmentId,
  forest: 'forest' as EstablishmentId,
  stadium: 'stadium' as EstablishmentId,
  tvStation: 'tvStation' as EstablishmentId,
  businessComplex: 'businessComplex' as EstablishmentId,
  cheeseFactory: 'cheeseFactory' as EstablishmentId,
  furnitureFactory: 'furnitureFactory' as EstablishmentId,
  mine: 'mine' as EstablishmentId,
  restaurant: 'restaurant' as EstablishmentId,
  appleOrchard: 'appleOrchard' as EstablishmentId,
  produceMarket: 'produceMarket' as EstablishmentId,
} as const;

export const allGameEstablishments: Record<EstablishmentId, Establishment> = {
  [establishmentsIds.wheatField]: {
    establishmentId: establishmentsIds.wheatField,
    domain: 'industry',
    tag: 'wheat',
    name: 'Wheat field',
    cost: 1,
    activation: [1],
    tagSrc: tagToUrlMap.wheat,
    imageSrc: 'http://localhost:3333/static/establishment-images/flower-garden.png',
    descriptionText: 'Receive 1 coin from the bank regardless of whose turn it is.',
  },
  [establishmentsIds.livestockFarm]: {
    establishmentId: establishmentsIds.livestockFarm,
    domain: 'industry',
    tag: 'livestock',
    name: 'Livestock Farm',
    cost: 1,
    activation: [2],
    tagSrc: tagToUrlMap.livestock,
    imageSrc: 'http://localhost:3333/static/establishment-images/ranch.png',
    descriptionText: 'Receive 1 coin from the bank regardless of whose turn it is.',
  },
  [establishmentsIds.bakery]: {
    establishmentId: establishmentsIds.bakery,
    domain: 'shopsFactoriesAndMarket',
    tag: 'box',
    name: 'Bakery',
    cost: 1,
    activation: [2, 3],
    tagSrc: tagToUrlMap.box,
    imageSrc: 'http://localhost:3333/static/establishment-images/bakery.png',
    descriptionText: 'Receive 1 coin from the bank if it’s your turn.',
  },
  [establishmentsIds.cafe]: {
    establishmentId: establishmentsIds.cafe,
    domain: 'restaurant',
    tag: 'cup',
    name: 'Cafe',
    cost: 2,
    activation: [3],
    tagSrc: tagToUrlMap.cup,
    imageSrc: 'http://localhost:3333/static/establishment-images/cafe.png',
    descriptionText: 'Receive 1 coin from any player who rolls this number.',
  },
  [establishmentsIds.convenienceStore]: {
    establishmentId: establishmentsIds.convenienceStore,
    domain: 'shopsFactoriesAndMarket',
    tag: 'box',
    name: 'Convenience Store',
    cost: 2,
    activation: [4],
    tagSrc: tagToUrlMap.box,
    imageSrc: 'http://localhost:3333/static/establishment-images/shop.png',
    descriptionText: 'Receive 3 coins from the bank if it’s your turn.',
  },
  [establishmentsIds.forest]: {
    establishmentId: establishmentsIds.forest,
    domain: 'industry',
    tag: 'gear',
    name: 'Forest',
    cost: 3,
    activation: [5],
    tagSrc: tagToUrlMap.gear,
    imageSrc: 'http://localhost:3333/static/establishment-images/forest.png',
    descriptionText: 'Receive 1 coin from the bank regardless of whose turn it is.',
  },
  [establishmentsIds.stadium]: {
    establishmentId: establishmentsIds.stadium,
    domain: 'majorEstablishment',
    tag: 'establishment',
    name: 'Stadium',
    cost: 6,
    activation: [6],
    tagSrc: tagToUrlMap.establishment,
    imageSrc: 'http://localhost:3333/static/major-establishment-images/stadium.png',
    descriptionText: 'Receive 2 coins from each player if it’s your turn.',
  },
  [establishmentsIds.tvStation]: {
    establishmentId: establishmentsIds.tvStation,
    domain: 'majorEstablishment',
    tag: 'establishment',
    name: 'TV Station',
    cost: 7,
    activation: [6],
    tagSrc: tagToUrlMap.establishment,
    imageSrc: 'http://localhost:3333/static/major-establishment-images/publisher.png',
    descriptionText: 'Receive 5 coins from one player of your choice if it’s your turn.',
  },
  [establishmentsIds.businessComplex]: {
    establishmentId: establishmentsIds.businessComplex,
    domain: 'majorEstablishment',
    tag: 'establishment',
    name: 'Business Complex',
    cost: 8,
    activation: [6],
    tagSrc: tagToUrlMap.establishment,
    imageSrc: 'http://localhost:3333/static/major-establishment-images/buisness-center.png',
    descriptionText: 'You may exchange one non-major establishment card with any other player if it’s your turn.',
  },
  [establishmentsIds.cheeseFactory]: {
    establishmentId: establishmentsIds.cheeseFactory,
    domain: 'shopsFactoriesAndMarket',
    tag: 'enterprise',
    name: 'Cheese Factory',
    cost: 5,
    activation: [7],
    tagSrc: tagToUrlMap.enterprise,
    imageSrc: 'http://localhost:3333/static/establishment-images/cheese-factory.png',
    descriptionText: 'Receive 3 coins from the bank for every Livestock Farm you have if it’s your turn.',
  },
  [establishmentsIds.furnitureFactory]: {
    establishmentId: establishmentsIds.furnitureFactory,
    domain: 'shopsFactoriesAndMarket',
    tag: 'enterprise',
    name: 'Furniture Factory',
    cost: 3,
    activation: [8],
    tagSrc: tagToUrlMap.enterprise,
    imageSrc: 'http://localhost:3333/static/establishment-images/furniture-factory.png',
    descriptionText: 'Receive 3 coins from the bank for every Forest you have if it’s your turn.',
  },
  [establishmentsIds.mine]: {
    establishmentId: establishmentsIds.mine,
    domain: 'industry',
    tag: 'gear',
    name: 'Mine',
    cost: 6,
    activation: [9],
    tagSrc: tagToUrlMap.gear,
    imageSrc: 'http://localhost:3333/static/establishment-images/mine.png',
    descriptionText: 'Receive 5 coins from the bank regardless of whose turn it is.',
  },
  [establishmentsIds.restaurant]: {
    establishmentId: establishmentsIds.restaurant,
    domain: 'restaurant',
    tag: 'cup',
    name: 'Restaurant',
    cost: 3,
    activation: [9, 10],
    tagSrc: tagToUrlMap.cup,
    imageSrc: 'http://localhost:3333/static/establishment-images/restaurant.png',
    descriptionText: 'Receive 2 coins from any player who rolls these numbers.',
  },
  [establishmentsIds.appleOrchard]: {
    establishmentId: establishmentsIds.appleOrchard,
    domain: 'industry',
    tag: 'wheat',
    name: 'Apple Orchard',
    cost: 3,
    activation: [10],
    tagSrc: tagToUrlMap.wheat,
    imageSrc: 'http://localhost:3333/static/establishment-images/apple-orchard.png',
    descriptionText: 'Receive 3 coins from the bank regardless of whose turn it is.',
  },
  [establishmentsIds.produceMarket]: {
    establishmentId: establishmentsIds.produceMarket,
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
