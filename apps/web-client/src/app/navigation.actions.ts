import {
  LOCATION_CHANGE,
  CALL_HISTORY_METHOD,
  LocationActionPayload,
  LocationChangePayload,
} from 'connected-react-router';
import { action, payload } from 'ts-action';

/*
 * !IMPORTANT
 * These actions are provided by 'connected-router-react' library
 * ts-action wrappers are for convenience only and should not be dispatched manually
 */
export namespace NavigationAction {
  export const locationChangeEvent = action(
    LOCATION_CHANGE,
    payload<LocationChangePayload>(),
  );

  export const callHistoryMethodEvent = action(
    CALL_HISTORY_METHOD,
    payload<LocationActionPayload>(),
  );
}
