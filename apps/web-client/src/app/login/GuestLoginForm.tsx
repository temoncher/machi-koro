import { FIRST_CHAR_USERNAME_REGEXP, USERNAME_REGEXP } from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useLoginActions } from './useLoginActions';
import './GuestLoginForm.css';

type GuestFormInputs = {
  username: string;
};

export const GuestLoginForm: React.FC = () => {
  const {
    register,
    // eslint-disable-next-line id-denylist
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<GuestFormInputs>({
    mode: 'all',
    defaultValues: { username: '' },
  });

  const { registerGuestCommand } = useLoginActions();
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
    registerGuestCommand(username);
  };

  return (
    <div className="guest-form">
      <h2 className="guest-form__title">{t('login.guestFormTitle')}</h2>
      <form onSubmit={handleSubmit(login)}>
        <label htmlFor="username">
          {t('login.guestFormLableUsername')}
          <input
            className={clsx({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'guest-form__input': true,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'guest-form__input_error': errors.username,
            })}
            id="username"
            maxLength={30}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('username', {
              validate: validateUsername,
            })}
          />
        </label>
        <p className="username-error">
          {errors.username && errors.username.message}
        </p>
        <button
          className="guest-form__button"
          disabled={!!errors.username || !isDirty}
          type="submit"
        >
          {t('login.guestFormButton')}
        </button>
      </form>
    </div>
  );
};
