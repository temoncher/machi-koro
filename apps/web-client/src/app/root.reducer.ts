import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { Reducer, combineReducers } from 'redux';

import { gameReducer } from './game';
import { lobbyReducer } from './lobby';
import { loginReducer } from './login';
import { RootState } from './root.state';
import { websocketReducer } from './websocket';

export const rootReducer = (history: History): Reducer<RootState> => combineReducers({
  loginReducer,
  lobbyReducer,
  gameReducer,
  websocketReducer,
  router: connectRouter(history),
});
