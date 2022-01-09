import { on, reducer } from 'ts-action';

import { LoadingAction } from './loading.actions';
import { initialLoadingState } from './loading.state';

export const loadingReducer = reducer(
  initialLoadingState,
  on(LoadingAction.setIsLoadingDocument, (state, action) => ({
    ...state,
    isLoading: action.payload,
  })),
);
