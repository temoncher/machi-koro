export namespace ArrayUtils {
  export const lastItem = <T>(collection: T[]): T | undefined => collection[collection.length - 1];
}
