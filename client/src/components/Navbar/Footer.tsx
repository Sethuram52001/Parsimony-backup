import { Typography, IconButton, AppBar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  return (
    <AppBar sx={{ top: 'auto', bottom: 0, backgroundColor: 'aliceblue' }}>
      <Typography color="black" align="center">
        Made with{' '}
        <IconButton>
          <FavoriteIcon style={{ color: 'red' }} />
        </IconButton>{' '}
        by Sethuram
      </Typography>
    </AppBar>
  );
};

export default Footer;
