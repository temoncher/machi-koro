import { LOCAL_URL } from '../constants';

export namespace UrlUtils {

  export const getBackgroundImageCard = (cardColor: string):
  string => `${LOCAL_URL}/static/background/${cardColor}.png`;

  export const getStaticImage = (imageName: string):
  string => `${LOCAL_URL}/static/icons/${imageName}.png`;

  export const getLastSegment = (pathname: string): string | undefined => {
    const currentUrl = pathname.split('/');
    const lastSegmentIndex = currentUrl.length - 1;

    return currentUrl[lastSegmentIndex];
  };
}
