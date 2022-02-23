import { connectingEpics, ConnectingEpicsDependencies } from './connecting.epics';
import { firebaseLobbiesEpic, FirebaseLobbiesEpicDependencies } from './firebase/lobbies-firebase.epic';
import { gameEpic, GameEpicDependencies } from './game';
import { lobbyEpic } from './lobby';
import { navigationEpic } from './navigation.epics';
import { notificationsEpic } from './notifications.epic';
import { typedCombineEpics } from './types/TypedEpic';

export type RootEpicDependencies =
  & GameEpicDependencies
  & ConnectingEpicsDependencies
  & FirebaseLobbiesEpicDependencies;

export const rootEpic = (deps: RootEpicDependencies) => typedCombineEpics(
  gameEpic(deps),
  lobbyEpic,
  connectingEpics(deps),
  navigationEpic,
  notificationsEpic,
  firebaseLobbiesEpic(deps),
);
