import React, { useState } from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import notifications from '../../../assets/temp data/notificationData';
import MenuButton from '../Other/MenuButton';

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState(notifications);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const unreadNotifications = items.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  return (
    <>
      <MenuButton
        aria-label="Open notifications"
        onClick={handleOpen}
        showBadge={unreadCount > 0}
        badgeContent={unreadCount}
      >
        <NotificationsIcon />
      </MenuButton>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { width: 300, maxHeight: 400, p: 0.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <List dense disablePadding>
          {unreadNotifications.map(({ id, message, timestamp }, idx) => (
            <React.Fragment key={id}>
              <ListItem
                alignItems="flex-start"
                dense
                disableGutters
                sx={{ py: 0.5, px: 1, position: 'relative' }}
              >
                {/* Subtle close icon in upper-right; only icon color changes on hover */}
                <IconButton
                  size="small"
                  onClick={() => handleMarkRead(id)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    color: 'text.secondary',
                    opacity: 0.4,
                    backgroundColor: 'transparent',
                    height: 20,
                    width: 20,
                    border: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'text.primary',
                      opacity: 1,
                    },
                  }}
                  aria-label="mark as read"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                <ListItemText
                  primary={
                    <Typography variant="caption" fontWeight={600}>
                      {dayjs(timestamp).format('DD.MM.YYYY')}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.primary" noWrap>
                      {message}
                    </Typography>
                  }
                  sx={{ mt: 0.25 }}
                />
              </ListItem>
              {idx < unreadNotifications.length - 1 && <Divider component="li" sx={{ my: 0 }} />}
            </React.Fragment>
          ))}
          {unreadCount === 0 && (
            <ListItem dense disableGutters sx={{ py: 1 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary" align="center">
                    No new notifications
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Menu>
    </>
  );
};

export default NotificationMenu;