import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector as useSelector } from '../../hooks/hooks';

interface UserGuardProps {
  children: React.ReactNode;
}

const UserGuard = ({ children }: UserGuardProps) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return <>{children}</>;
};

export default UserGuard;
