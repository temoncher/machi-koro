import { FIRST_CHAR_USERNAME_REGEXP, USERNAME_REGEXP } from '@machikoro/game-server-contracts';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../hooks';

import { RegisterGuestAction } from './registerGuest.endpoint';

type GuestFormInputs = {
  username: string;
};

export const GuestLoginForm: React.FC = () => {
  const {
    control,
    // eslint-disable-next-line id-denylist
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<GuestFormInputs>({
    mode: 'all',
    defaultValues: { username: '' },
  });

  const { isLoading } = useTypedSelector((state) => state.requests.registerGuestReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const validateUsername = useCallback((name: string) => {
    if (!name.length) {
      return t('login.usernameEmptyErrorMessage');
    }

    if (name[0] && !FIRST_CHAR_USERNAME_REGEXP.test(name[0])) {
      return t('login.usernameFirstCharacterErrorMessage');
    }

    if (!USERNAME_REGEXP.test(name)) {
      return t('login.usernameRestrictedCharactersErrorMessage');
    }

    return undefined;
  }, [t]);

  const login = ({ username }: GuestFormInputs) => {
    dispatch(RegisterGuestAction.registerGuestCommand([username]));
  };

  return (
    <Paper sx={{ minWidth: 400, p: 4 }}>
      <Typography sx={{ mb: 2 }} variant="h4">{t('login.guestFormTitle')}</Typography>
      <Box
        noValidate
        sx={{ display: 'flex', flexDirection: 'column' }}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(login)}
      >
        <Controller
          control={control}
          name="username"
          rules={{
            validate: validateUsername,
          }}
          render={({ field }) => (
            <TextField
              ref={field.ref}
              required
              sx={{ mb: 2 }}
              name={field.name}
              label={t('login.guestFormLableUsername')}
              error={!!errors.username}
              helperText={errors.username && errors.username.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isLoading}
          disabled={!!errors.username || !isDirty}
          loadingIndicator={t('login.registerGuestButtonTextLoading')}
        >
          {t('login.registerGuestButtonText')}
        </LoadingButton>
      </Box>
    </Paper>
  );
};
