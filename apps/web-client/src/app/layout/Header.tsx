import {
  Box,
  Button,
  MenuItem,
  SxProps,
  FormControl,
  Menu,
  Link,
} from '@mui/material';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

type HeaderProps = {
  sx?: SxProps;
};

const languageCodeToRepresentationMap = {
  'ru-RU': 'Русский',
  'en-US': 'English (US)',
} as const;

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | undefined>(undefined);
  const languageMenuOpen = Boolean(anchorEl);

  const openLanguageMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeLanugageMenu = () => {
    setAnchorEl(undefined);
  };

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        py: 1.5,
        px: 3,
        ...props.sx,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Link component={RouterLink} variant="h6" underline="none" to="/">
          {t('gameName')}
        </Link>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <FormControl>
          <Button value={i18n.language} onClick={openLanguageMenu}>{languageText}</Button>
          <Menu
            anchorEl={anchorEl}
            open={languageMenuOpen}
            onClose={closeLanugageMenu}
          >
            {Object.entries(languageCodeToRepresentationMap).map(([languageCode, languageRepresentation]) => (
              <MenuItem
                key={languageCode}
                value={languageCode}
                onClick={() => {
                  changeLanguage(languageCode);
                }}
              >
                {languageRepresentation}
              </MenuItem>
            ))}
          </Menu>
        </FormControl>
      </Box>
    </Box>
  );
};
