import { LOCAL_URL } from '../constants';

export namespace UrlUtils {
  export const getBackgroundImageCard = (cardColor: `brand${string}`): string => {
    const color = cardColor.slice(5).toLocaleLowerCase();

    return `${LOCAL_URL}/static/background/${color}.png`;
  };

  export const getStaticImage = (imageName: string): string => `${LOCAL_URL}/static/icons/${imageName}.png`;

  export const getLastSegment = (pathname: string): string | undefined => {
    const currentUrl = pathname.split('/');
    const lastSegmentIndex = currentUrl.length - 1;

    return currentUrl[lastSegmentIndex];
  };
}
