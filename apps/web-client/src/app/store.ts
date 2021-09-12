import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import {
  createStore,
  compose,
  applyMiddleware,
  Middleware,
} from 'redux';
import thunk from 'redux-thunk';

import { LOCAL_URL } from './constants';
import { RootApi } from './root.api';
import { rootReducer } from './root.reducer';
import { RootState } from './root.state';
import { initHttpClient } from './utils';

declare global {
  interface Window {
    // eslint-disable-next-line
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const thunkWrapper: Middleware<unknown, RootState> = (storeApi) => {
  const getHeaders = () => storeApi.getState().loginReducer.headers;
  const httpClient = initHttpClient(`${LOCAL_URL}/api`);

  const rootApi = RootApi.init({ getHeaders, httpClient });

  return thunk.withExtraArgument(rootApi)(storeApi);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const initStore = (history: History<unknown>) => createStore(
  rootReducer(history),
  composeEnhancers(applyMiddleware(routerMiddleware(history), thunkWrapper)),
);
