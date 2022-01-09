import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';

import { App, initializeI18n, initStore } from './app';
import { LOCAL_URL } from './app/constants';
import { getAuthorizationHeader, initHttpClient, initSocketConnection } from './app/utils';

import './styles.css';

const main = () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  initializeI18n(LanguageDetector, initReactI18next);

  const history = createBrowserHistory();
  const httpClient = initHttpClient(`${LOCAL_URL}/api`, getAuthorizationHeader);
  const socket = initSocketConnection(LOCAL_URL, getAuthorizationHeader);
  const store = initStore({ socket, history, httpClient });

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
