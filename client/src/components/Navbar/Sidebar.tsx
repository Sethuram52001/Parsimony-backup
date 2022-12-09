import { Link } from 'react-router-dom';
import { Box, List, ListItem, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Sidebar = () => {
  return (
    <Box
      sx={{
        height: { md: '100%' },
        width: { xs: '100vw', md: 'auto' },
        display: 'flex',
        alignItems: { xs: 'flex-end', md: 'center' },
        justifyContent: 'center',
        position: 'fixed',
        top: { xs: 'auto', md: '15px' },
        bottom: { xs: '0', md: 'auto' },
        left: { md: '20px' },
        'z-index': '2',
      }}
    >
      <List
        id="navlist"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          backgroundColor: 'aliceblue',
          height: { md: '80%' },
          borderRadius: '25px',
          justifyContent: 'space-evenly',
        }}
      >
        <ListItem>
          <Link to="/">
            <IconButton>
              <HomeIcon />
            </IconButton>
          </Link>
        </ListItem>
        <ListItem>
          <Link to="/dashboard">
            <IconButton>
              <DashboardIcon />
            </IconButton>
          </Link>
        </ListItem>
        <ListItem>
          <Link to="/transactions">
            <IconButton>
              <ReceiptIcon />
            </IconButton>
          </Link>
        </ListItem>
        <ListItem>
          <IconButton>
            <AnalyticsIcon />
          </IconButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
