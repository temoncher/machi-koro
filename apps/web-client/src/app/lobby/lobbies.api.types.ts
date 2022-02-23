import {
  Lobby,
  LobbyId,
  User,
  UserId,
} from '@machikoro/game-server-contracts';
import { Observable } from 'rxjs';

export type LeaveLobby = (userId: UserId, lobbyId: LobbyId) => Promise<void>;
export type JoinLobby = (user: User, lobbyId: LobbyId) => Promise<void>;
export type GetLobbyState$ = (lobbyId: LobbyId) => Observable<Lobby | undefined>;
export type GetLobby = (lobbyId: LobbyId) => Promise<Lobby | undefined>;
export type CreateLobby = (hostId: UserId, capacity: number) => Promise<Lobby>;
