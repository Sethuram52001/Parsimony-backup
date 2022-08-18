import axios from 'axios';
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    event.preventDefault();
    const registrationData = JSON.stringify({
      name,
      email,
      password,
    });

    const response = await axios.post('http://localhost:5000/api/register', {
      registrationData,
    });
    console.log(response);
  };

  return (
    <Box
      component="form"
      textAlign="center"
      alignItems="center"
      sx={{ width: 300 }}
    >
      <Typography variant="h4">Register</Typography>
      <Divider />
      <TextField
        variant="filled"
        label="Name"
        fullWidth
        sx={{ mb: 2, mt: 2 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        type="email"
        variant="filled"
        label="Email"
        fullWidth
        sx={{ mb: 2 }}
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
        onClick={() => handleRegister}
      >
        Register
      </Button>
    </Box>
  );
};

export default RegistrationForm;
