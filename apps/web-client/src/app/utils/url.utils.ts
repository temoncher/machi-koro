export namespace UrlUtils {
  export const getLastSegment = (pathname: string): string | undefined => {
    const currentUrl = pathname.split('/');
    const lastSegmentIndex = currentUrl.length - 1;

    return currentUrl[lastSegmentIndex];
  };
}
