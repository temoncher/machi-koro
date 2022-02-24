import { ConnectedRouter } from 'connected-react-router';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { createBrowserHistory } from 'history';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';

import { App, initializeI18n, initStore } from './app';
import { getAuthorizationHeader } from './app/utils/getAuthorizationHeader';
import { initHttpClient } from './app/utils/http-client';
import { environment } from './environments/environment';

import './styles.css';

const main = () => {
  const SERVER_PORT = 3333;
  // eslint-disable-next-line no-restricted-globals
  const SERVER_HOST = `http://${window.location.hostname}:${SERVER_PORT}`;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  initializeI18n(LanguageDetector, initReactI18next);

  const firebaseApp = initializeApp(environment.firebaseConfig);
  const firebaseAuth = getAuth(firebaseApp);
  const firebaseDb = getDatabase(firebaseApp);
  const firebaseFunctions = getFunctions(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const firestorage = getStorage(firebaseApp);

  if (process.env.NODE_ENV !== 'production') {
    connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
    connectDatabaseEmulator(firebaseDb, 'localhost', 9000);
    connectFunctionsEmulator(firebaseFunctions, 'localhost', 5001);
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectStorageEmulator(firestorage, 'localhost', 9199);
  }

  const history = createBrowserHistory();
  const httpClient = initHttpClient(`${SERVER_HOST}/api`, getAuthorizationHeader);
  const store = initStore({
    history,
    httpClient,
    firebaseAuth,
    firebaseDb,
    firestore,
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
