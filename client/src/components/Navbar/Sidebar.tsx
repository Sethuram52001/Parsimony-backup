import { Link } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReceiptIcon from '@mui/icons-material/Receipt';
const Sidebar = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <List
        id="navlist"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          backgroundColor: 'red',
          height: { md: '80%' },
        }}
      >
        <ListItem>
          <Link to="/dashboard">
            <IconButton>
              <HomeIcon />
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
