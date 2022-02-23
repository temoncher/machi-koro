import { connectingEpics, ConnectingEpicsDependencies } from './connecting.epics';
import { firebaseLobbiesEpic, FirebaseLobbiesEpicDependencies } from './firebase/lobbies-firebase.epic';
import { gameEpic, GameEpicDependencies } from './game';
import { lobbyEpic, LobbyEpicDependencies } from './lobby';
import { loginEpic, LoginEpicDependencies } from './login';
import { navigationEpic } from './navigation.epics';
import { notificationsEpic } from './notifications.epic';
import { typedCombineEpics } from './types/TypedEpic';
import {
  lobbyWebsocketEpic,
  gameWebsocketEpic,
  websocketEpic,
  WebsocketEpicDependencies,
} from './websocket';

export type RootEpicDependencies =
  & GameEpicDependencies
  & LobbyEpicDependencies
  & LoginEpicDependencies
  & LoginEpicDependencies
  & ConnectingEpicsDependencies
  & WebsocketEpicDependencies
  & FirebaseLobbiesEpicDependencies;

export const rootEpic = (deps: RootEpicDependencies) => typedCombineEpics(
  gameEpic(deps),
  lobbyEpic(deps),
  loginEpic(deps),
  connectingEpics(deps),
  navigationEpic,
  notificationsEpic,
  websocketEpic(deps),
  gameWebsocketEpic,
  lobbyWebsocketEpic,
  firebaseLobbiesEpic(deps),
);
