import i18n, {
  TFunction,
  ThirdPartyModule,
  LanguageDetectorModule,
  Newable,
} from 'i18next';

import { ROOT_EN_TRANSLATIONS } from './root-en.translations';
import { ROOT_RU_TRANSLATIONS } from './root-ru.translations';

declare module 'react-i18next' {
  interface Resources {
    'en-US': typeof ROOT_EN_TRANSLATIONS;
    'ru-RU': typeof ROOT_RU_TRANSLATIONS;
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en-US';
    resources: {
      'en-US': typeof ROOT_EN_TRANSLATIONS;
      'ru-RU': typeof ROOT_RU_TRANSLATIONS;
    };
  }
}

// TODO: make storybook translatable?
export const initializeI18n = async (
  LanguageDetector: Newable<LanguageDetectorModule>,
  initReactI18n: ThirdPartyModule,
): Promise<TFunction> => i18n
  .use(LanguageDetector)
  .use(initReactI18n)
  .init({
    fallbackLng: 'en-US',
    debug: process.env.NODE_ENV === 'development',
    resources: {
      'en-US': {
        translation: ROOT_EN_TRANSLATIONS,
      },
      'ru-RU': {
        translation: ROOT_RU_TRANSLATIONS,
      },
    },
  });
