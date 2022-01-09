import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { Reducer, combineReducers } from 'redux';

import { gameReducer } from './game';
import { loadingReducer } from './loading';
import { lobbyReducer } from './lobby';
import { loginReducer } from './login';
import { RootState } from './root.state';
import { websocketReducer } from './websocket';

export const rootReducer = (history: History<unknown>): Reducer<RootState> => combineReducers({
  loginReducer,
  loadingReducer,
  lobbyReducer,
  gameReducer,
  websocketReducer,
  router: connectRouter(history),
});
