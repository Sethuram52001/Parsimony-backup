import { AppBar, Toolbar, IconButton, Box, Typography } from '@mui/material';
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Parsimony
          </Typography>
          <div>
            <IconButton onClick={handleLogout} sx={{ p: 0 }} color="inherit">
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
