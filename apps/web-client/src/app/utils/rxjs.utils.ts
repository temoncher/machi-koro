export namespace RxjsUtils {
  export const isDefined = <T>(value: T): value is Exclude<T, undefined> => value !== undefined;
}
