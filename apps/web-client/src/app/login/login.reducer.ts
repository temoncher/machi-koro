import { LoginAction, LoginActionTypes } from './login.actions';
import { initialLoginState, LoginState } from './login.state';

// eslint-disable-next-line @typescript-eslint/default-param-last
export const loginReducer = (state: LoginState = initialLoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case LoginActionTypes.SET_LOGIN_PARAMS: {
      return {
        ...state,
        username: action.payload.username,
        userId: action.payload.userId,
        headers: action.payload.headers,
      };
    }

    default:
      return state;
  }
};
