import { combineReducers } from 'redux';

import { loginReducer } from './login/login.reducer';

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  loginReducer,
});
