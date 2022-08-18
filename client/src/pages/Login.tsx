import { Paper, Container } from '@mui/material';
import * as React from 'react';
import { Outlet } from 'react-router-dom';

const Login = () => {
  return (
    <React.Fragment>
      <Container
        maxWidth="xl"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper
          sx={{
            width: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 5,
            p: 5,
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </React.Fragment>
  );
};

export default Login;
