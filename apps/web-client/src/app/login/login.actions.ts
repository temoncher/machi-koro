export enum LoginActionTypes {
  SET_USERNAME = 'APP/SET_USERNAME',
}

interface SetUsername {
  type: LoginActionTypes.SET_USERNAME;
  payload: string;
}

export type LoginAction = SetUsername;

const setUsername = (username: string): LoginAction => ({
  type: LoginActionTypes.SET_USERNAME,
  payload: username,
});

export const loginActions = {
  setUsername,
};
