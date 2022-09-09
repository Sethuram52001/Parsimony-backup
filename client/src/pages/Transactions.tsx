import * as React from 'react';
import { Transactions as Records, Filter } from '../components';

const Transactions = () => {
  return (
    <React.Fragment>
      <h1>Transactions</h1>
      <Filter />
      <Records />
    </React.Fragment>
  );
};

export default Transactions;
