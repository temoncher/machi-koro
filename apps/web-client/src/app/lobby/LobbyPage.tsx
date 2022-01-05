import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useGameActions } from '../game/useGameActions';
import { useTypedSelector } from '../hooks';
import { initializeSocket, joinLobby, leaveLobby } from '../socket';
import { UrlUtils } from '../utils';

import { PlayerCard, Player } from './PlayerCard';

import './LobbyPage.css';

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Artem',
    status: 'active',
    loginType: 'guest',
  },
  {
    id: '2',
    name: 'Alex',
    status: 'active',
    loginType: 'guest',
  },
  {
    id: '3',
    name: 'Kirill',
    status: 'active',
    loginType: 'guest',
  },
  {
    id: '4',
    name: 'Julia',
    status: 'notActive',
    loginType: 'guest',
  },
];

export const LobbyPage: React.FC = () => {
  const { isJoinLobbyLoading } = useTypedSelector((state) => state.lobbyReducer);
  const { userId } = useTypedSelector((state) => state.loginReducer);
  const { t } = useTranslation();
  const lobbyId = useTypedSelector((state) => {
    const { pathname } = state.router.location;

    return UrlUtils.getLastSegment(pathname);
  });

  const { createGameThunk } = useGameActions();
  const createGame = (): void => {
    if (lobbyId) {
      createGameThunk({ lobbyId });
    } else {
      // eslint-disable-next-line no-console
      console.error('LobbyId is missing');
    }
  };

  useEffect(() => {
    initializeSocket();

    if (lobbyId) {
      joinLobby(lobbyId);
    } else {
      // eslint-disable-next-line no-console
      console.error('LobbyId is missing');
    }
  }, [lobbyId]);

  const requestToLeaveLobby = () => {
    if (lobbyId) {
      leaveLobby(lobbyId);
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
          {mockPlayers.map((player) => (
            <PlayerCard key={player.id} isHighlighted={player.id === userId} player={player} />
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
        {isJoinLobbyLoading && (
          <button
            className="lobby-buttons-container__button"
            type="submit"
            onClick={() => { requestToLeaveLobby(); }}
          >
            {t('lobby.leaveLobbyButtonText')}
          </button>
        )}
      </section>
    </div>
  );
};
