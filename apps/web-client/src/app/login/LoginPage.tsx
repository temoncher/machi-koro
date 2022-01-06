import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { GuestLoginForm } from './GuestLoginForm';

import './LoginPage.css';

enum LoginPageState {
  GUEST_BUTTON = 'guest-button',
  GUEST_FORM = 'guest-form',
}

export const LoginPage: React.FC = () => {
  const [loginPageState, setLoginPageState] = useState<LoginPageState>(LoginPageState.GUEST_BUTTON);
  const { t } = useTranslation();

  const renderLoginFromContent = () => match(loginPageState)
    .with(LoginPageState.GUEST_FORM, () => <GuestLoginForm />)
    .with(LoginPageState.GUEST_BUTTON, () => (
      <button
        className="login-button"
        type="button"
        onClick={() => {
          setLoginPageState(LoginPageState.GUEST_FORM);
        }}
      >
        {t('login.tryAsGuestButtonText')}
      </button>
    ))
    .exhaustive();

  return <div className="login-container">{renderLoginFromContent()}</div>;
};
