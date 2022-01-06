import { action, payload } from 'ts-action';

enum LoadingActionType {
  SET_IS_LOADING_DOCUMENT = '[Document] APP/Loading/SET_IS_LOADING',
}

export const setIsLoadingDocument = action(
  LoadingActionType.SET_IS_LOADING_DOCUMENT,
  payload<boolean>(),
);

export type LoadingAction = ReturnType<typeof setIsLoadingDocument>;

export const loadingActions = {
  setIsLoadingDocument,
};
