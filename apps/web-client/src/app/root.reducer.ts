import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { Reducer, combineReducers } from 'redux';

import { gameReducer } from './game';
import { lobbyReducer } from './lobby';
import { registerGuestReducer, loginReducer } from './login';
import { RootState } from './root.state';

export const rootReducer = (history: History): Reducer<RootState> => combineReducers({
  loginReducer,
  lobbyReducer,
  gameReducer,
  router: connectRouter(history),
  requests: combineReducers({
    registerGuestReducer,
  }),
});
