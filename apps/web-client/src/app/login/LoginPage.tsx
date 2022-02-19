import { Box, Button, SxProps } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { GuestLoginForm } from './GuestLoginForm';

enum LoginPageState {
  GUEST_BUTTON = 'guest-button',
  GUEST_FORM = 'guest-form',
}

type LoginPageProps = {
  sx?: SxProps;
};

export const LoginPage: React.FC<LoginPageProps> = (props) => {
  const [loginPageState, setLoginPageState] = useState<LoginPageState>(LoginPageState.GUEST_BUTTON);
  const { t } = useTranslation();

  const renderLoginFromContent = () => match(loginPageState)
    .with(LoginPageState.GUEST_FORM, () => <GuestLoginForm />)
    .with(LoginPageState.GUEST_BUTTON, () => (
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            setLoginPageState(LoginPageState.GUEST_FORM);
          }}
        >
          {t('login.tryAsGuestButtonText')}
        </Button>
      </Box>
    ))
    .exhaustive();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.sx,
      }}
    >
      {renderLoginFromContent()}
    </Box>
  );
};
