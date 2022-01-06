import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { lobbyActions } from './lobby.actions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useLobbyActions = () => {
  const dispatch = useDispatch();

  // `useDispatch` will be typed exactly after `bindActionCreators` is called
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return bindActionCreators(lobbyActions, dispatch);
};
