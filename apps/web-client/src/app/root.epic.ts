import { connectingEpics, ConnectingEpicsDependencies } from './connecting.epics';
import { firebaseLobbiesEpic, FirebaseLobbiesEpicDependencies } from './firebase/lobbies-firebase.epic';
import { gameEpic, GameEpicDependencies } from './game';
import { lobbyEpic, LobbyEpicDependencies } from './lobby';
import { navigationEpic } from './navigation.epics';
import { notificationsEpic } from './notifications.epic';
import { typedCombineEpics } from './types/TypedEpic';

export type RootEpicDependencies =
  & GameEpicDependencies
  & LobbyEpicDependencies
  & ConnectingEpicsDependencies
  & FirebaseLobbiesEpicDependencies;

export const rootEpic = (deps: RootEpicDependencies) => typedCombineEpics(
  gameEpic(deps),
  lobbyEpic(deps),
  connectingEpics(deps),
  navigationEpic,
  notificationsEpic,
  firebaseLobbiesEpic(deps),
);
