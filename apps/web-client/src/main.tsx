import LanguageDetector from 'i18next-browser-languagedetector';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app/App';
import { initializeI18n } from './app/i18n';
import { store } from './app/store';

import './styles.css';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
initializeI18n(LanguageDetector, initReactI18next);

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root'),
);
