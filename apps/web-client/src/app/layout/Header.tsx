import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import './Header.css';

type HeaderProps = {
  className?: string;
};

const languageCodeToRepresentationMap = {
  'ru-RU': 'Русский',
  'en-US': 'English (US)',
} as const;

export const Header: React.FC<HeaderProps> = ({ className }: HeaderProps) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    i18n.changeLanguage(language);
  };

  const languageText = useMemo(() => {
    const languageCode = i18n.language as keyof typeof languageCodeToRepresentationMap;

    /** i18n.language can be typed only with the string */
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return languageCodeToRepresentationMap[languageCode] ?? languageCodeToRepresentationMap['en-US'];
  }, [i18n.language]);

  return (
    <div className={clsx('header', className)}>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {t('gameName')}
        </h2>
      </div>
      <div className="flex">
        <Listbox value={i18n.language} onChange={changeLanguage}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="select-langs">
                <span className="flex items-center">
                  <span>{languageText}</span>
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                show={open}
              >
                <Listbox.Options static className="select-langs__options">
                  {Object.entries(languageCodeToRepresentationMap).map(([languageCode, languageRepresentation]) => (
                    <Listbox.Option
                      key={languageCode}
                      className="select-langs__option"
                      value={languageCode}
                    >
                      <div className="flex items-center">
                        <span>{languageRepresentation}</span>
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
    </div>
  );
};
