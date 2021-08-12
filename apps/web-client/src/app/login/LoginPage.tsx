import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTypedSelector } from '../hooks/useTypedSelector';

import { GuestLoginForm } from './GuestLoginForm';
import './LoginPage.css';

type LoginPageState = 'guest-button' | 'guest-form' | 'greeting';
type RenderGuestButtonProps = {
  onClick: () => void;
  buttonText: string;
};
type RenderGreetingProps = {
  greetingText: string;
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

const renderGreeting = ({ greetingText }: RenderGreetingProps) => (
  <h2 className="text-2xl">{`${greetingText}`}</h2>
);

export const LoginPage: React.FC = () => {
  const [loginPageState, setLoginPageState] = useState<LoginPageState>('guest-button');
  const { username } = useTypedSelector((state) => state.loginReducer);
  const { t } = useTranslation();

  const renderLoginFromContent = () => {
    switch (loginPageState) {
      case 'guest-form':
        return <GuestLoginForm submitForm={() => { setLoginPageState('greeting'); }} />;
      case 'greeting':
        return renderGreeting({ greetingText: t('login.greeting', { username: `${username}` }) });
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
