import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginForm,
  RegistrationForm,
  GuestGuard,
  UserGuard,
  Navbar,
} from './components';
import Sidebar from './components/Navbar/Sidebar';
import { Login, Dashboard, Transactions } from './pages';
import Grid from '@mui/material/Unstable_Grid2';

const App = () => {
  return (
    <BrowserRouter>
      <Grid
        container
        sx={{
          height: '100vh',
        }}
      >
        <Grid xs={12} md={2} order={{ xs: 2, md: 1 }}>
          <Sidebar />
        </Grid>
        <Grid xs={12} md={10} order={{ xs: 1, md: 2 }}>
          <Routes>
            <Route
              path="/login"
              element={
                <UserGuard>
                  <Login />
                </UserGuard>
              }
            >
              <Route path="new-user" element={<RegistrationForm />} />
              <Route path="" element={<LoginForm />} />
            </Route>
            <Route
              path="/dashboard"
              element={
                <GuestGuard>
                  <Dashboard />
                </GuestGuard>
              }
            />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
};

export default App;
