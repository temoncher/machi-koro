import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks';
import { initializeSocket, joinLobby, leaveLobby } from '../socket';

import { PlayerCard, Player } from './PlayerCard';

import './LobbyPage.css';

type LobbyProps = {
  currentUserId: string;
};

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

const getLobbyId = (pathname: string): string | undefined => {
  const currentUrl = pathname.split('/');
  const numberOfSubstringWithLobbyId = currentUrl.length - 1;
  const lobbyId = currentUrl[numberOfSubstringWithLobbyId];

  return lobbyId;
};

export const LobbyPage: React.FC<LobbyProps> = ({ currentUserId }: LobbyProps) => {
  const { isJoinLobbyLoading } = useTypedSelector((state) => state.lobbyReducer);
  const { t } = useTranslation();
  const lobbyId = useTypedSelector((state) => {
    const { pathname } = state.router.location;

    return getLobbyId(pathname);
  });

  const createGame = (): void => { };

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
          {
            mockPlayers.map((player) => (
              <PlayerCard player={player} isHighlighted={player.id === currentUserId} key={player.id} />
            ))
          }
        </div>
      </section>
      <section className="lobby-buttons-container">
        <button
          type="submit"
          className="lobby-buttons-container__button"
          onClick={createGame}
        >
          {t('lobby.startNewGameButtonText')}
        </button>
        {isJoinLobbyLoading ? (
          <>
            <button
              type="submit"
              className="lobby-buttons-container__button"
              onClick={() => { requestToLeaveLobby(); }}
            >
              {t('lobby.leaveLobbyButtonText')}
            </button>
          </>
        ) : <></>}
      </section>
    </div>
  );
};
