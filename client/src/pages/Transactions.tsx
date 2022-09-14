import * as React from 'react';
import { TransactionsList, Filter } from '../components';

const Transactions = () => {
  return (
    <React.Fragment>
      <h1>Transactions</h1>
      <Filter />
      <TransactionsList />
    </React.Fragment>
  );
};

export default Transactions;
