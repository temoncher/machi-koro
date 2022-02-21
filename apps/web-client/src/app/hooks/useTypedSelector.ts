import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '../root.state';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
