import { Typography, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  return (
    <Typography width="100%" color="black" align="center">
      Made with{' '}
      <IconButton>
        <FavoriteIcon style={{ color: 'red' }} />
      </IconButton>{' '}
      by Sethuram
    </Typography>
  );
};

export default Footer;
