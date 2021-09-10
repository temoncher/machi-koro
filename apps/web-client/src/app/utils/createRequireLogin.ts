import { Next } from 'react-router-guards';
import { GuardFunctionRouteProps, GuardToRoute } from 'react-router-guards/dist/types';
import { Dispatch, Store } from 'redux';

import { getUserData } from '../login/login.actions';
import { RootAction } from '../root.actions';
import { RootState } from '../root.state';

export const createRequireLogin = (store: Store<RootState, RootAction>, dispatch: Dispatch<any>) => async (
  to: GuardToRoute,
  from: GuardFunctionRouteProps | null,
  next: Next,
): Promise<void> => {
  // TODO: refactor the guard to not depend on dispatch returning a promise
  // eslint-disable-next-line @typescript-eslint/await-thenable
  await dispatch(getUserData());

  const { username } = store.getState().loginReducer;

  if (username === '') {
    next.redirect('/login');
  } else {
    next();
  }
};
