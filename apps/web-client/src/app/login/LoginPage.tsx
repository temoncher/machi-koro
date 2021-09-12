import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import { useTypedSelector } from '../hooks';

import { GuestLoginForm } from './GuestLoginForm';

import './LoginPage.css';

type LoginPageState = 'guest-button' | 'guest-form' | 'greeting';
type RenderGuestButtonProps = {
  onClick: () => void;
  buttonText: string;
};

const renderGuestButton = ({ onClick, buttonText }: RenderGuestButtonProps) => (
  <button
    type="button"
    className="login-button"
    onClick={onClick}
  >
    {buttonText}
  </button>
);

export const LoginPage: React.FC = () => {
  const { username } = useTypedSelector((state) => state.loginReducer);
  const [loginPageState, setLoginPageState] = useState<LoginPageState>('guest-button');
  const { t } = useTranslation();

  useEffect(() => {
    setLoginPageState(username === '' ? 'guest-button' : 'greeting');
  }, [username]);

  const renderLoginFromContent = () => {
    switch (loginPageState) {
      case 'guest-form':
        return <GuestLoginForm />;
      case 'greeting': return <Redirect to="/" exact />;
      default:
        return renderGuestButton({ onClick: () => { setLoginPageState('guest-form'); }, buttonText: t('login.tryAsGuestButtonText') });
    }
  };

  return (
    <div className="login-container">
      {renderLoginFromContent()}
    </div>
  );
};
