import { LOCAL_URL } from '../constants';

export namespace URLUtils {

  export const getBackgroundImageCard = (cardColor: string):
  string => `${LOCAL_URL}/static/background/${cardColor}.png`;

  export const getStaticImageURL = (imageName: string):
  string => `${LOCAL_URL}/static/icons/${imageName}.png`;
}
