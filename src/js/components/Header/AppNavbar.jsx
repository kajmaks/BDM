import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import MenuButton from '../Other/MenuButton';
import ColorModeIconSwitch from './ColorModeIconSwitch';
import LogoSwitcher from '../Other/LogoSwitcher';
import LogoDark from '../../../assets/images/bdm-short-bw.svg';
import LogoLight from '../../../assets/images/bdm-short.svg';
import LanguageIconSwitch from './LanguageIconSwitch';
import { useAuth } from '../Other/AuthContext';
import { handleLogin } from '../Other/LoginHandler';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import OptionsMenu from '../Other/OptionsMenu';
import { Box } from '@mui/material';

export default function AppNavbar({ locale, setLocale }) {
  const { isLoggedIn, login } = useAuth();

  const handleClick = () => {
    const loginSuccess = handleLogin();
    if (loginSuccess) {
      login();
    }
  };

  return (
    <AppBar
      sx={{
        display: { xs: 'flex', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.default',
        padding: '1rem',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        height: 'auto',
        alignItems: 'center',
      }}
    >
      <LogoSwitcher
        logoDark={LogoDark}
        logoLight={LogoLight}
        alt="LogoNavbar"
        wh={'w'}
        parameter={45}
      />
      <Stack direction="row" sx={{ gap: 1, marginLeft: 'auto' }}>
        <LanguageIconSwitch locale={locale} onLocaleChange={setLocale} />
        <ColorModeIconSwitch />
        {isLoggedIn ? (
          <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
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
    </AppBar>
  );
}
