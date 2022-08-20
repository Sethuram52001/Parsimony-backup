import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import {
  LoginForm,
  RegistrationForm,
  GuestGuard,
  UserGuard,
  Navbar,
} from './components';
import Dashboard from './pages/Dashboard';

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
