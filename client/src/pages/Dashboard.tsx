import * as React from 'react';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token);
      console.log(user);
      if (!user) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } else {
      console.log('token not present');
    }
  }, []);

  return (
    <React.Fragment>
      <h1>Dashboard</h1>
    </React.Fragment>
  );
};

export default Dashboard;
