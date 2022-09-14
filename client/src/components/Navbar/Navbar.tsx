import * as React from 'react';

import { AppBar, Toolbar, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log('logout was clicked');
    localStorage.removeItem('token');
    dispatch(authActions.logout());
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton onClick={handleLogout} sx={{ p: 0 }}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
