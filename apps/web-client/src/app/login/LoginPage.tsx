import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './LoginPage.css';
import { GuestLoginForm } from './GuestLoginForm';

enum LoginPageState {
  GUEST_BUTTON = 'guest-button',
  GUEST_FORM = 'guest-form',
}

export const LoginPage: React.FC = () => {
  const [loginPageState, setLoginPageState] = useState<LoginPageState>(LoginPageState.GUEST_BUTTON);
  const { t } = useTranslation();

  const renderLoginFromContent = () => {
    switch (loginPageState) {
      case 'guest-form':
        return <GuestLoginForm />;
      default:
        return (
          <button
            type="button"
            className="login-button"
            onClick={() => { setLoginPageState(LoginPageState.GUEST_FORM); }}
          >
            {t('login.tryAsGuestButtonText')}
          </button>
        );
    }
  };

  return (
    <div className="login-container">
      {renderLoginFromContent()}
    </div>
  );
};
