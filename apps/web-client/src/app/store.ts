import {
  createStore, compose, applyMiddleware,
} from 'redux';

import { rootReducer } from './root.reducer';

declare global {
  interface Window {
    // eslint-disable-next-line
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware());

export const store = createStore(rootReducer, enhancer);
