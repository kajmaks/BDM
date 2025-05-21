import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import MenuButton from './MenuButton';
import { handleLogout } from './LoginHandler';
import { useAuth } from './AuthContext';
import Profile from '../../../assets/images/placeholders/profilePick.png';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();

  const handleLogoutClick = () => {
    const logoutSuccess = handleLogout();
    if (logoutSuccess) {
      logout();
    }
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ width: 'auto', border: 'none' }}
      >
        <img src={Profile} alt="profile" style={{ width: '30px', height: '30px' }} />
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
        <MenuItem onClick={handleClose}>Moje konto</MenuItem>
        <MenuItem onClick={handleClose}>Moje wskaźniki</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Wyloguj</MenuItem>
      </Menu>
    </React.Fragment>
  );
}
