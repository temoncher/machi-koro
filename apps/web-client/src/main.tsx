import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import LanguageDetector from 'i18next-browser-languagedetector';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';

import { App } from './app/App';
import { initializeI18n } from './app/i18n';
import { initStore } from './app/store';
import './styles.css';

const main = () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  initializeI18n(LanguageDetector, initReactI18next);

  const history = createBrowserHistory();

  ReactDOM.render(
    <StrictMode>
      <Provider store={initStore(history)}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </StrictMode>,
    document.getElementById('root'),
  );
};

main();
