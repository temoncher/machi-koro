import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks';
import { useLobbyActions } from '../lobby';

import './HomePage.css';

export const HomePage: React.FC = () => {
  const { createLobbyCommand } = useLobbyActions();
  const { username } = useTypedSelector((state) => state.loginReducer);
  const { isCreateLobbyLoading } = useTypedSelector((state) => state.lobbyReducer);
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <h2 className="text-2xl">{t('home.greeting', { username })}</h2>
      <p className="p-4 text-center">{t('home.welcomeText')}</p>
      <button
        className="new-lobby-button"
        disabled={isCreateLobbyLoading}
        type="button"
        onClick={createLobbyCommand}
      >
        {t('home.createNewLobbyButtonText')}
      </button>
    </div>
  );
};
