import { CommonEstablishmentType, LandmarkDomain } from '@machikoro/game-server-contracts';

import cowSrc from './images/cow.png';
import cupSrc from './images/cup.png';
import factorySrc from './images/factory.png';
import fruitSrc from './images/fruit.png';
import gearSrc from './images/gear.png';
import landmarkSrc from './images/landmark.png';
import majorSrc from './images/major.png';
import shopSrc from './images/shop.png';
import wheatSrc from './images/wheat.png';

// TODO replace these images
export const tagToEmblemSrcMap: Record<CommonEstablishmentType | LandmarkDomain, string> = {
  wheat: wheatSrc,
  livestock: cowSrc,
  box: shopSrc,
  cup: cupSrc,
  gear: gearSrc,
  enterprise: factorySrc,
  apple: fruitSrc,
  establishment: majorSrc,
  landmark: landmarkSrc,
};
