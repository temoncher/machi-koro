import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks';
import { useLobbyActions } from '../lobby';

import './HomePage.css';

export const HomePage: React.FC = () => {
  const { createLobbyThunk } = useLobbyActions();
  const { username, userId } = useTypedSelector((state) => state.loginReducer);
  const { t } = useTranslation();

  const createLobbyRequest = () => { createLobbyThunk({ hostId: userId }); };

  return (
    <div className="home-container">
      <h2 className="text-2xl">{t('home.greeting', { username })}</h2>
      <p className="p-4 text-center">
        {t('home.welcomeText')}
      </p>
      <button className="new-lobby-button" type="button" onClick={createLobbyRequest}>{t('home.createNewLobbyButtonText')}</button>
    </div>
  );
};
