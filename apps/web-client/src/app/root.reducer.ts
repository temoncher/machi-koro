import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { Reducer, combineReducers } from 'redux';

import { loadingReducer } from './loading/loading.reducer';
import { lobbyReducer } from './lobby/lobby.reducer';
import { loginReducer } from './login/login.reducer';
import { RootState } from './root.state';

export const rootReducer = (history: History<unknown>): Reducer<RootState> => combineReducers({
  loginReducer,
  loadingReducer,
  lobbyReducer,
  router: connectRouter(history),
});
