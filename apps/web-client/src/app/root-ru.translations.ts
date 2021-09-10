import { GAME_RU_TRANSLATIONS } from './game/game-ru.translations';
import { HOME_RU_TRANSLATIONS } from './home/home-ru.translations';
import { LOBBY_RU_TRANSLATIONS } from './lobby/lobby-ru.translations';
import { LOGIN_RU_TRANSLATIONS } from './login/login-ru.translations';
import { ROOT_EN_TRANSLATIONS } from './root-en.translations';

export const ROOT_RU_TRANSLATIONS: typeof ROOT_EN_TRANSLATIONS = {
  gameName: 'Мачи Коро',
  login: LOGIN_RU_TRANSLATIONS,
  home: HOME_RU_TRANSLATIONS,
  lobby: LOBBY_RU_TRANSLATIONS,
  game: GAME_RU_TRANSLATIONS,
};
