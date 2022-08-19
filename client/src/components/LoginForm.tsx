import axios from 'axios';
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/authSlice';

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
      console.log(localStorage.getItem('token'));
      dispatch(authActions.login());
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
        onClick={(event) => handleLogin(event)}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
