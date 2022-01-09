import { combineEpics } from 'redux-observable';

import {
  connectingEpics,
  ConnectingEpicsDependencies,
} from './connecting.epics';
import { gameEpic, GameEpicDependencies } from './game';
import { lobbyEpic, LobbyEpicDependencies } from './lobby';
import { loginEpic, LoginEpicDependencies } from './login';
import { navigationEpic } from './navigation.epics';
import { RootAction } from './root.actions';
import { RootState } from './root.state';
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
  & ConnectingEpicsDependencies
  & WebsocketEpicDependencies;

export const rootEpic = (deps: RootEpicDependencies) => combineEpics<RootAction, RootAction, RootState, unknown>(
  gameEpic(deps),
  lobbyEpic(deps),
  loginEpic(deps),
  connectingEpics(deps),
  navigationEpic,
  websocketEpic(deps),
  gameWebsocketEpic,
  lobbyWebsocketEpic,
);
