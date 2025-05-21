import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationButton from './NotificationButton';
import ColorModeIconSwitch from './ColorModeIconSwitch';
import OptionsMenu from '../Other/OptionsMenu';
import { Divider, Button } from '@mui/material';
import logoDark from '../../../assets/images/bdm-pl-bw.svg';
import logoLight from '../../../assets/images/Bela GUS_BDM pełne PL 80 px.svg';
import LanguageIconSwitch from './LanguageIconSwitch';
import FontSizeIconSwitch from './FontSizeIconSwitch';
import LogoSwitcher from '../Other/LogoSwitcher';
import { handleLogin } from '../Other/LoginHandler';
import { useAuth } from '../Other/AuthContext';

export default function Header({ locale, setLocale }) {
  const { isLoggedIn, login } = useAuth();

  const handleClick = () => {
    const loginSuccess = handleLogin();
    if (loginSuccess) {
      login();
    }
  };

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        minHeight: '4rem',
        pt: 1.5,
      }}
      spacing={2}
    >
      <LogoSwitcher
        logoDark={logoDark}
        logoLight={logoLight}
        alt="Główne logo"
        parameter={30}
        wh="w"
      />
      <Stack direction="row" sx={{ gap: 1, marginLeft: 'auto' }}>
        <LanguageIconSwitch locale={locale} onLocaleChange={setLocale} />
        <FontSizeIconSwitch />
        <ColorModeIconSwitch />
        {isLoggedIn ? (
          <NotificationButton />
        ) : (
          <></>
        )}
        <Divider orientation="vertical" flexItem />
        {isLoggedIn ? (
          <OptionsMenu />
        ) : (
          <Button
            variant="text"
            onClick={handleClick}
            sx={{
              width: 'auto',
              border: 'none',
              color: '#0087CD',
              fontSize: '1.5em',
            }}
          >
            Zaloguj
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
