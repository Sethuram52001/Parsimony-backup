import { useState } from 'react';
import { AspectRatio } from '@mui/joy';
import { Box, TextField, Button } from '@mui/material';
import RegistrationFormStudent from '../../assets/images/registration_form.jpg';
import axios from 'axios';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    await axios.post('http://localhost:5000/api/user/register', {
      name,
      email,
      password,
    });
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
          <img src={RegistrationFormStudent} alt="register form student icon" />
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
          variant="filled"
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          sx={{ mb: 2, width: '90%' }}
          variant="filled"
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{ mb: 2, width: '90%' }}
          variant="filled"
          label="Password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          sx={{ width: '90%' }}
          variant="contained"
          onClick={(e) => handleRegister(e)}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
