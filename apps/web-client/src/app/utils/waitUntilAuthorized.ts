import {
  filter,
  timeout,
  map,
  of,
  switchMap,
  first,
  withLatestFrom,
  Observable,
} from 'rxjs';

import { RootState } from '../root.state';
import { LoginStatus } from '../types/LoginStatus';

export const waitUntilAuthorized = (state$: Observable<RootState>, duration = 10000) => <T>(source$: Observable<T>) => source$.pipe(
  withLatestFrom(state$),
  switchMap(([somePayload, state]) => {
    if (state.loginReducer.status === LoginStatus.AUTHORIZED) {
      return of([somePayload, state.loginReducer] as const);
    }

    return state$.pipe(
      filter((newState) => newState.loginReducer.status === LoginStatus.AUTHORIZED),
      timeout({ first: duration }),
      first(),
      // This cast is safe, because we just filtered login reducer status
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map((newState) => {
        if (newState.loginReducer.status !== LoginStatus.AUTHORIZED) {
          throw new Error('Should be authorized at this point');
        }

        return [somePayload, newState.loginReducer] as const;
      }),
    );
  }),
);
