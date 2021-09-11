import { render, waitFor } from '@testing-library/react';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { App } from './App';

describe('App', () => {
  it('should render successfully', async () => {
    const history = createBrowserHistory();

    const initialState = undefined;
    const store = createStore(combineReducers({ router: connectRouter(history) }), initialState);

    const { baseElement } = render(<Provider store={store}><ConnectedRouter history={history}><App /></ConnectedRouter></Provider>);

    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });

  it('should have a greeting as the title', async () => {
    const history = createBrowserHistory();

    const initialState = undefined;
    const store = createStore(combineReducers({ router: connectRouter(history) }), initialState);

    const { getByText } = render(<Provider store={store}><ConnectedRouter history={history}><App /></ConnectedRouter></Provider>);

    await waitFor(() => {
      expect(getByText('English (US)')).toBeTruthy();
    });
  });
});
