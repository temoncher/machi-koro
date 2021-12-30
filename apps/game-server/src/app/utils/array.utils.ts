export namespace ArrayUtils {
  export const lastItem = <T>(collection: T[]): T | undefined => collection[collection.length - 1];
  export const splitAt = <T>(i: number, collection: T[]): [T[], T[]] => [[...collection].splice(0, i), [...collection].slice(i)];
}
