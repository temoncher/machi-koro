import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGameActions } from '../game/useGameActions';
import { useTypedSelector } from '../hooks';
import { UrlUtils } from '../utils';

import { UserCard } from './UserCard';
import { useLobbyActions } from './useLobbyActions';

import './LobbyPage.css';

export const LobbyPage: React.FC = () => {
  const { userId } = useTypedSelector((state) => state.loginReducer);
  const lobby = useTypedSelector((state) => state.lobbyReducer.lobby);
  const { t } = useTranslation();
  const lobbyId = useTypedSelector((state) => {
    const { pathname } = state.router.location;

    return UrlUtils.getLastSegment(pathname);
  });

  const { createGameCommand } = useGameActions();
  const { leaveLobbyCommand } = useLobbyActions();

  const createGame = (): void => {
    if (lobbyId) {
      createGameCommand({ lobbyId });
    } else {
      // eslint-disable-next-line no-console
      console.error('LobbyId is missing');
    }
  };

  const requestToLeaveLobby = () => {
    if (lobbyId) {
      leaveLobbyCommand(lobbyId);
    } else {
      // eslint-disable-next-line no-console
      console.error('LobbyId is missing');
    }
  };

  return (
    <div className="lobby-container">
      <section className="lobby-players-list">
        <div className="lobby-players-list__header">
          {t('lobby.playersSectionTitle')}
        </div>
        <div className="lobby-players-list__container">
          {lobby?.users.map((user) => (
            <UserCard
              key={user.userId}
              isHighlighted={user.userId === userId}
              user={user}
            />
          ))}
        </div>
      </section>
      <section className="lobby-buttons-container">
        <button
          className="lobby-buttons-container__button"
          type="submit"
          onClick={createGame}
        >
          {t('lobby.startNewGameButtonText')}
        </button>
        <button
          className="lobby-buttons-container__button"
          type="submit"
          onClick={requestToLeaveLobby}
        >
          {t('lobby.leaveLobbyButtonText')}
        </button>
      </section>
    </div>
  );
};
