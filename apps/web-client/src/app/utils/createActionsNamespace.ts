import { action, ActionCreator, Typed } from 'ts-action';

type Empty = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _as: 'empty';
};
// eslint-disable-next-line @typescript-eslint/ban-types
type EmptyActionCreator<K extends string> = ActionCreator<K, () => Typed<{}, K>>;

type Payload<P> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _as: 'payload';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _p: P;
};
type PayloadActionCreator<K extends string, P> = ActionCreator<K, (payload: P) => Typed<{
  payload: P;
}, K>>;

type SnakeToCamel<T extends string> = T extends `${infer TBefore}_${infer TAfter}`
  ? `${Lowercase<TBefore>}${Capitalize<SnakeToCamel<TAfter>>}`
  : Lowercase<T>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TakeLastAfter<T extends string, A extends string> = T extends `${infer TBefore}${A}${infer TAfter}`
  ? TakeLastAfter<TAfter, A>
  : T;

type ExtractActionType<T extends string> = T extends `[${infer AType}]${string}` ? Capitalize<Lowercase<AType>> : never;

type ActionType = 'DOCUMENT' | 'EVENT' | 'COMMAND';
type ActionName = `[${ActionType}] ${string}`;

const capitalizeLowercased = (str: string) => str.charAt(0).toUpperCase() + str.toLocaleLowerCase().slice(1);
export const createActionsNamespace = <R extends Record<ActionName, Payload<unknown> | Empty>>(actionTypeToPayloadMap: R): {
  [
  K in keyof R as K extends string
    ? `${SnakeToCamel<TakeLastAfter<K, '/'>>}${ExtractActionType<K>}`
    : never
  ]: K extends string
    ? R[K] extends Empty
      ? EmptyActionCreator<K>
      : R[K] extends Payload<infer P>
        ? PayloadActionCreator<K, P>
        : never
    : never;
} => {
  const res = Object.fromEntries(
    Object.entries(actionTypeToPayloadMap)
      .map(([type, actionPayload]) => {
        const createdAction = action(type, actionPayload as any);
        const [uppercasedActionType] = type.slice(1).split(']');
        const actionType = capitalizeLowercased(uppercasedActionType!);
        const actionPath = type.split('/');
        const actionName = actionPath[actionPath.length - 1]!
          .split('_')
          .map((word, wordIndex) => (wordIndex === 0 ? word.toLocaleLowerCase() : capitalizeLowercased(word)))
          .join('');

        return [actionName + actionType, createdAction];
      }),
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res as any;
};

export type GetNamespaceActionType<T extends Record<string, ActionCreator>> = {
  [K in keyof T]: ReturnType<T[K]>
}[keyof T];
