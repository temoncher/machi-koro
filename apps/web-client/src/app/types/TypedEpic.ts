import { Action, AnyAction } from 'redux';
import { Epic } from 'redux-observable';

export type TypedEpic<
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Output extends (...args: any[]) => Action = () => AnyAction,
State = unknown,
> = Epic<AnyAction, ReturnType<Output>, State, unknown>;
