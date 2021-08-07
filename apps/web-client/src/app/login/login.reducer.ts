import { LoginAction, LoginActionTypes } from './login.actions';

export interface LoginState {
  username: string;
}

const initialLoginState: LoginState = {
  username: '',
};

// eslint-disable-next-line
export const loginReducer = (state: LoginState = initialLoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case LoginActionTypes.SET_USERNAME: {
      return {
        ...state,
        username: action.payload,
      };
    }

    default:
      return state;
  }
};
