import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { authActions } from '../../store/authSlice';
import { Box, TextField, Button } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import LoginFormStudent from '../../assets/images/login_form.jpg';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const res = await axios.post('http://localhost:5000/api/user/login', {
      email,
      password,
    });

    if (res.data.token) {
      alert('login successful');
      localStorage.setItem('token', JSON.stringify(res.data.token));
      dispatch(authActions.login());
    } else {
      alert('Invalid login credentials');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mb: 2, width: { xs: '90%', md: '45%' } }}>
        <AspectRatio objectFit="contain">
          <img src={LoginFormStudent} alt="login form student icon" />
        </AspectRatio>
      </Box>
      <Box
        sx={{
          width: { xs: '90%', md: '45%' },
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <TextField
          sx={{ mb: 2, width: '90%' }}
          type="email"
          variant="filled"
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{ mb: 2, width: '90%' }}
          type="password"
          variant="filled"
          label="Password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          sx={{ width: '90%' }}
          variant="contained"
          onClick={(e) => handleLogin(e)}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
