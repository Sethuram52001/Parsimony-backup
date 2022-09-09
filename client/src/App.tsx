import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginForm,
  RegistrationForm,
  GuestGuard,
  UserGuard,
  Navbar,
} from './components';
import { Login, Dashboard, Transactions } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
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
    </BrowserRouter>
  );
};

export default App;
