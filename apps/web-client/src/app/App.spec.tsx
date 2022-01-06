import { render, waitFor } from '@testing-library/react';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer } from 'ts-action';

import { App } from './App';
import { initialLoginState, LoginState } from './login';

describe('App', () => {
  it('should render successfully', async () => {
    const history = createBrowserHistory();

    const rootReducer = combineReducers({
      loginReducer: reducer<LoginState>(initialLoginState),
      router: connectRouter(history),
    });
    const initialState = undefined;
    const store = createStore(rootReducer, initialState);

    const { baseElement } = render(<Provider store={store}><ConnectedRouter history={history}><App /></ConnectedRouter></Provider>);

    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
