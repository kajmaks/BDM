import * as React from 'react';
import { useState } from 'react';
import { AuthProvider } from './components/Other/AuthContext';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/Header/AppNavbar';
import Header from './components/Header/Header';
import MainGrid from './components/MainGrid/MainGrid';

import AppTheme from './theme/AppTheme';

export default function App(props) {
  const [locale, setLocale] = useState('plPL');

  return (
    <AuthProvider>
      <AppTheme {...props} locale={locale} setLocale={setLocale}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <AppNavbar locale={locale} setLocale={setLocale} />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header locale={locale} setLocale={setLocale} />
              <MainGrid />
            </Stack>
          </Box>
        </Box>
      </AppTheme>
    </AuthProvider>
  );
}
