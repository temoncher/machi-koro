export enum LoadingActionTypes {
  SET_IS_LOADING = 'APP/SET_IS_LOADING',
}

interface SetIsLoading {
  type: LoadingActionTypes.SET_IS_LOADING;
  payload: boolean;
}

export type LoadingAction = SetIsLoading;

export const setIsLoading = (isLoading: boolean): LoadingAction => ({
  type: LoadingActionTypes.SET_IS_LOADING,
  payload: isLoading,
});

export const loadingActions = {
  setIsLoading,
};
