import { LoadingAction, LoadingActionTypes } from './loading.actions';
import { initialLoadingState, LoadingState } from './loading.state';

// eslint-disable-next-line @typescript-eslint/default-param-last
export const loadingReducer = (state: LoadingState = initialLoadingState, action: LoadingAction): LoadingState => {
  switch (action.type) {
    case LoadingActionTypes.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    default:
      return state;
  }
};
