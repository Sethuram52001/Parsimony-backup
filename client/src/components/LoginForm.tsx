import axios from 'axios';
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log('clicked login');
    const loginData = JSON.stringify({
      email,
      password,
    });
    const res = await axios.post('http://localhost:5000/api/login', {
      loginData,
    });
    if (res.data.user) {
      alert('login successful');
      localStorage.setItem('token', res.data.user);
      console.log(res.data.user);
      window.location.href = '/dashboard';
    } else {
      alert('invalid login credentials');
    }
  };

  return (
    <Box
      component="form"
      textAlign="center"
      alignItems="center"
      sx={{ width: 300 }}
    >
      <Typography variant="h4">Login</Typography>
      <Divider />
      <TextField
        type="email"
        variant="filled"
        label="Email"
        fullWidth
        sx={{ mb: 2, mt: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        type="password"
        variant="filled"
        label="Password"
        fullWidth
        sx={{ mb: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        sx={{ width: '90%' }}
        onClick={() => handleLogin}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
