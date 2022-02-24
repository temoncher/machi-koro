import { connectingEpics, ConnectingEpicsDependencies } from './connecting.epics';
import { firebaseGamesEpic, FirebaseGamesEpicDependencies } from './firebase/games-firebase.epic';
import { firebaseLobbiesEpic, FirebaseLobbiesEpicDependencies } from './firebase/lobbies-firebase.epic';
import { gameEpic } from './game';
import { homeEpic } from './home';
import { lobbyEpic } from './lobby';
import { navigationEpic } from './navigation.epics';
import { notificationsEpic } from './notifications.epic';
import { typedCombineEpics } from './types/TypedEpic';

export type RootEpicDependencies =
  & ConnectingEpicsDependencies
  & FirebaseLobbiesEpicDependencies
  & FirebaseGamesEpicDependencies;

export const rootEpic = (deps: RootEpicDependencies) => typedCombineEpics(
  homeEpic,
  gameEpic,
  lobbyEpic,
  connectingEpics(deps),
  navigationEpic,
  notificationsEpic,
  firebaseLobbiesEpic(deps),
  firebaseGamesEpic(deps),
);
