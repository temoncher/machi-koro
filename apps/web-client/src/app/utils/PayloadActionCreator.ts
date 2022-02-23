import { ActionCreator, Typed } from 'ts-action';

export type PayloadActionCreator<K extends string, P> = ActionCreator<K, (payload: P) => Typed<{
  payload: P;
}, K>>;
