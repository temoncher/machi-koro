import { map } from 'rxjs';
import { ofType } from 'ts-action-operators';

import { typedCombineEpics, TypedEpic } from '../types/TypedEpic';
import { waitUntilAuthorized } from '../utils/waitUntilAuthorized';

import { HomeAction } from './home.actions';
import { CreateLobbyAction } from './home.endpoints';

const createLobbyOnCreateLobbyButtonClickedEvent: TypedEpic<
typeof CreateLobbyAction.createLobbyCommand
> = (actions$, state$) => actions$.pipe(
  ofType(HomeAction.createLobbyButtonClickedEvent),
  waitUntilAuthorized(state$),
  // TODO: remove hardcoded capacity
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map(([action, { userId }]) => CreateLobbyAction.createLobbyCommand([userId, 4])),
);

export const homeEpic = typedCombineEpics<
| HomeAction
| CreateLobbyAction
>(
  createLobbyOnCreateLobbyButtonClickedEvent,
);
