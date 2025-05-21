import * as React from 'react';
import { PolishFlag, UKFlag } from '../../../assets/CustomIcons';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

export default function LanguageIconSwitch({ locale, onLocaleChange }) {
  const handleToggle = () => {
    const newLocale = locale === 'enGB' ? 'plPL' : 'enGB';
    onLocaleChange(newLocale);
  };

  return (
    <IconButton
      onClick={handleToggle}
      disableRipple
      size="medium"
      sx={{
        p: 0.5,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          overflow: 'hidden',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {locale === 'enGB' ? <UKFlag /> : <PolishFlag />}
      </Box>
    </IconButton>
  );
}
