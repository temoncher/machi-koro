import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '../root.reducer';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
