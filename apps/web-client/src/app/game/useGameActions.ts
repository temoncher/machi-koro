import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { gameActions } from './game.actions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useGameActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(gameActions, dispatch);
};
