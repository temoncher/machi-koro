import { LOGIN_EN_TRANSLATIONS } from './login-en.translations';

export const LOGIN_RU_TRANSLATIONS: typeof LOGIN_EN_TRANSLATIONS = {
  tryAsGuestButtonText: 'Гостевой режим',
  guestFormTitle: 'Вход',
  guestFormLableUsername: 'Укажите имя',
  guestFormButton: 'Войти',
  greeting: 'Здравствуйте, {{username}}!',
  usernameEmptyErrorMessage: 'Поле обязательное для заполнения',
  usernameFirstCharacterErrorMessage: 'Имя должно начинаться с латинского символа',
  usernameRestrictedCharactersErrorMessage: 'Имя должно состоять только из латинских символов, пробелов и дефисов',
};
