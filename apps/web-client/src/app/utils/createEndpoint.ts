import { AnyAction } from 'redux';
import { Epic } from 'redux-observable';
import {
  catchError,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
import {
  action,
  payload,
  reducer,
  on,
  Reducer,
} from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { PayloadActionCreator } from './PayloadActionCreator';
import { SnakeToCamel } from './SnakeToCamel';
import { capitalize } from './capitalize';

type RequestName<N extends string> = `${Uppercase<N>}_COMMAND` | `${Uppercase<N>}_RESOLVED_EVENT` | `${Uppercase<N>}_REJECTED_EVENT`;

type RequestNamespace<N extends string, A, R> = {
  [K in RequestName<N> as SnakeToCamel<K>]: K extends `${string}_RESOLVED_EVENT`
    ? PayloadActionCreator<`[EVENT] @requests/${N}_RESOLVED`, R>
    : K extends `${string}_REJECTED_EVENT`
      ? PayloadActionCreator<`[EVENT] @requests/${N}_REJECTED`, unknown>
      : K extends `${string}_COMMAND`
        ? PayloadActionCreator<`[COMMAND] @requests/${N}`, A>
        : never;
};

export type GetStateType<T> = T extends Reducer<infer R> ? R : never;

export const createEndpoint = <Req extends (...args: any[]) => Promise<any>>() => <N extends string>(name: N) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions

  type A = Parameters<Req>;
  type R = ReturnType<Req> extends Promise<infer Res> ? Res : never;

  const toCamel = (str: string) => str.split('_')
    .map((word, wordIndex) => (wordIndex === 0 ? word.toLocaleLowerCase() : capitalize(word.toLocaleLowerCase())))
    .join('');

  const fireRequestCommand = action(`[COMMAND] @requests/${name}`, payload<A>());
  const requestResolvedEvent = action(`[EVENT] @requests/${name}_RESOLVED`, payload<R>());
  const requestRejectedEvent = action(`[EVENT] @requests/${name}_REJECTED`, payload<unknown>());

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const requestNamespace = {
    [toCamel(`${name}_COMMAND`)]: fireRequestCommand,
    [toCamel(`${name}_RESOLVED_EVENT`)]: requestResolvedEvent,
    [toCamel(`${name}_REJECTED_EVENT`)]: requestRejectedEvent,
  } as RequestNamespace<N, A, R>;

  const initialState: {
    isLoading: boolean;
    // eslint-disable-next-line id-denylist
    data: R | undefined;
    error: unknown;
  } = {
    isLoading: false,
    // eslint-disable-next-line id-denylist
    data: undefined,
    error: undefined,
  };

  const requestReducer = reducer(
    initialState,
    on(fireRequestCommand, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(requestResolvedEvent, (state, resolvedAction) => ({
      ...state,
      // eslint-disable-next-line id-denylist
      data: resolvedAction.payload,
      isLoading: false,
      error: undefined,
    })),
    on(requestRejectedEvent, (state, rejectedAction) => ({
      ...state,
      isLoading: false,
      error: rejectedAction.payload,
      // eslint-disable-next-line id-denylist
      data: undefined,
    })),
  );

  const epicFactory = (request: (...args: A) => Promise<R>): Epic<AnyAction, AnyAction, unknown, unknown> => (actions$) => actions$.pipe(
    ofType(fireRequestCommand),
    toPayload(),
    switchMap((actionPayload) => from(request(...actionPayload)).pipe(
      map(requestResolvedEvent),
      catchError((error) => of(requestRejectedEvent(error))),
    )),
  );

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const namespacePart = {
    [`${capitalize(toCamel(name))}Action`]: requestNamespace,
  } as {
    [K in N as `${Capitalize<SnakeToCamel<K>>}Action`]: RequestNamespace<N, A, R>;
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const epicFactoryPart = {
    [`${toCamel(name)}Epic`]: epicFactory,
  } as {
    [K in N as `${SnakeToCamel<K>}Epic`]: typeof epicFactory;
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const reducerPart = {
    [`${toCamel(name)}Reducer`]: requestReducer,
  } as {
    [K in N as `${SnakeToCamel<K>}Reducer`]: typeof requestReducer;
  };

  return {
    ...namespacePart,
    ...epicFactoryPart,
    ...reducerPart,
  };
};
