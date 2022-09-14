import * as React from 'react';
import { TransactionsList } from '../components';

const Dashboard = () => {
  return (
    <React.Fragment>
      <h1>Dashboard</h1>
      <TransactionsList />
    </React.Fragment>
  );
};

export default Dashboard;
