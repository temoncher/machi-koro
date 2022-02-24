export const isDefined = <T>(value: T): value is Exclude<T, undefined | null> => value !== undefined && value !== null;
