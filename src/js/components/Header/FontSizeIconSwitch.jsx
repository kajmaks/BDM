import * as React from 'react';
import { useState } from 'react';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import MenuButton from '../Other/MenuButton';
import IconButton from '@mui/material/IconButton';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import Box from '@mui/material/Box';

export default function LanguageIconSwitch() {
  const [size, setSize] = useState('normal');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <MenuButton aria-label="Open menu" onClick={handleClick}>
        <Box
          sx={{
            width: 24,
            height: 24,
            overflow: 'hidden',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0.5,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <TextIncreaseIcon />
        </Box>
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem>Powiększenie czcionki A+</MenuItem>
        <MenuItem>Pomniejszenie czcionki A-</MenuItem>
        <MenuItem>Normalna czcionka</MenuItem>
      </Menu>
    </React.Fragment>
  );
}
