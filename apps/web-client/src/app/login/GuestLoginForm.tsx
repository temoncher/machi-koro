import {
  FIRST_CHAR_USERNAME_REGEXP,
  USERNAME_REGEXP,
} from '@machikoro/game-server-contracts/username-validation';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useLoginActions } from './useLoginActions';

import './GuestLoginForm.css';

type GuestLoginFormProps = {
  submitForm: () => void;
};
type GuestFormInputs = {
  username: string;
};

export const GuestLoginForm: React.FC<GuestLoginFormProps> = ({
  submitForm,
}: GuestLoginFormProps) => {
  const {
    register,
    // eslint-disable-next-line id-denylist
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<GuestFormInputs>({
    mode: 'all',
    defaultValues: { username: '' },
  });

  const { setUsername } = useLoginActions();

  const validateUsername = useCallback((name: string) => {
    if (!name.length) {
      return 'Nickname should not be empty';
    }

    if (!FIRST_CHAR_USERNAME_REGEXP.test(name[0])) {
      return 'Nickname should start with a character';
    }

    if (!USERNAME_REGEXP.test(name)) {
      return 'The nickname should only consist of Latin characters, spaces and hyphens';
    }

    return undefined;
  }, []);

  const login = ({ username }: GuestFormInputs) => {
    setUsername(username);
    submitForm();
  };

  return (
    <div className="guest-form">
      <h2 className="guest-form__title">Login</h2>
      <form onSubmit={handleSubmit(login)}>
        <input
          className={clsx(
            'guest-form__input',
            errors.username && 'guest-form__input_error',
          )}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('username', {
            validate: validateUsername,
          })}
        />
        <p className="username-error">
          {errors.username && errors.username.message}
        </p>
        <button
          type="submit"
          className="guest-form__button"
          disabled={!!errors.username || !isDirty}
        >
          Login
        </button>
      </form>
    </div>
  );
};
