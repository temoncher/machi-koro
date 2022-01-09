import { on, reducer } from 'ts-action';

import { WebsocketAction } from './websocket.actions';
import { initialWebsocketState } from './websocket.state';

export const websocketReducer = reducer(
  initialWebsocketState,
  on(WebsocketAction.setSocketConnectionStatusDocument, (state, action) => ({
    ...state,
    status: action.payload,
  })),
);
