import { on, reducer } from 'ts-action';

import { setIsLoadingDocument } from './loading.actions';
import { initialLoadingState } from './loading.state';

export const loadingReducer = reducer(
  initialLoadingState,
  on(setIsLoadingDocument, (state, action) => ({
    ...state,
    isLoading: action.payload,
  })),
);
