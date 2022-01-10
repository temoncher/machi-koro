import { Action, AnyAction } from 'redux';
import { combineEpics, Epic } from 'redux-observable';

import { RootState } from '../root.state';

export type TypedEpic<
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Output extends (...args: any[]) => Action = () => AnyAction,
> = Epic<AnyAction, ReturnType<Output>, RootState, unknown>;

export const typedCombineEpics = <O extends Action>(
  ...epics: TypedEpic<() => O>[]
) => combineEpics<AnyAction, O, RootState, unknown>(...epics);
