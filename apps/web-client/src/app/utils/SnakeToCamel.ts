export type SnakeToCamel<T extends string> = T extends `${infer TBefore}_${infer TAfter}`
  ? `${Lowercase<TBefore>}${Capitalize<SnakeToCamel<TAfter>>}`
  : Lowercase<T>;
