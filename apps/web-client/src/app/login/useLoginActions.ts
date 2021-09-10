import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loginActions } from './login.actions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useLoginActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(loginActions, dispatch);
};
