import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginForm,
  RegistrationForm,
  GuestGuard,
  UserGuard,
  Navbar,
  Sidebar,
  Footer,
} from './components';
import {
  Login,
  Dashboard,
  Transactions,
  LandingPage,
  Analytics,
} from './pages';
import Grid from '@mui/material/Unstable_Grid2';

const App = () => {
  return (
    <BrowserRouter>
      <Grid container sx={{ height: '100vh' }}>
        <Grid xs={12}>
          <Navbar />
        </Grid>
        <Grid xs={12} md={2} order={{ xs: 3, md: 2 }}>
          <Sidebar />
        </Grid>
        <Grid xs={12} md={10} order={{ xs: 2, md: 3 }}>
          <Routes>
            <Route path="" element={<LandingPage />} />
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
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
};

export default App;
