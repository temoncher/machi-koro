import React, { useState } from 'react';

import { useTypedSelector } from '../hooks/useTypedSelector';

import { GuestLoginForm } from './GuestLoginForm';
import './LoginPage.css';

type LoginPageState = 'guest-button' | 'guest-form' | 'greeting';
type RenderGuestButtonProps = {
  onClick: () => void;
};
type RenderGreetingProps = {
  username: string;
};

const renderGuestButton = ({ onClick }: RenderGuestButtonProps) => (
  <button
    type="button"
    className="login-button"
    onClick={onClick}
  >
    Try as a guest
  </button>
);

const renderGreeting = ({ username }: RenderGreetingProps) => (
  <h2 className="text-2xl">{`Hello, ${username}!`}</h2>
);

export const LoginPage: React.FC = () => {
  const [loginPageState, setLoginPageState] = useState<LoginPageState>('guest-button');
  const { username } = useTypedSelector((state) => state.loginReducer);

  const renderLoginFromContent = () => {
    switch (loginPageState) {
      case 'guest-form':
        return <GuestLoginForm submitForm={() => { setLoginPageState('greeting'); }} />;
      case 'greeting':
        return renderGreeting({ username });
      default:
        return renderGuestButton({ onClick: () => { setLoginPageState('guest-form'); } });
    }
  };

  return (
    <div className="login-container">
      {renderLoginFromContent()}
    </div>
  );
};
