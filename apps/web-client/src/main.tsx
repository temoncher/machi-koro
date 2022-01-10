import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';

import { App, initializeI18n, initStore } from './app';
import { getAuthorizationHeader } from './app/utils/getAuthorizationHeader';
import { initHttpClient } from './app/utils/http-client';
import { initSocketConnection } from './app/utils/socket';

import './styles.css';

const main = () => {
  const SERVER_PORT = 3333;
  // eslint-disable-next-line no-restricted-globals
  const SERVER_HOST = `http://${window.location.hostname}:${SERVER_PORT}`;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  initializeI18n(LanguageDetector, initReactI18next);

  const history = createBrowserHistory();
  const httpClient = initHttpClient(`${SERVER_HOST}/api`, getAuthorizationHeader);
  const socket = initSocketConnection(SERVER_HOST, getAuthorizationHeader);
  const store = initStore({
    socket,
    history,
    httpClient,
    // eslint-disable-next-line no-restricted-globals
    storage: window.localStorage,
  });

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  );
};

main();
