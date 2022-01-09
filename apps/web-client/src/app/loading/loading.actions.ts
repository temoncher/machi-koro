import { action, payload } from 'ts-action';

enum LoadingActionType {
  SET_IS_LOADING_DOCUMENT = '[DOCUMENT] APP/LOADING/SET_IS_LOADING',
}

export namespace LoadingAction {
  export const setIsLoadingDocument = action(
    LoadingActionType.SET_IS_LOADING_DOCUMENT,
    payload<boolean>(),
  );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LoadingAction = ReturnType<typeof LoadingAction.setIsLoadingDocument>;
