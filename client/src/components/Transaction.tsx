import React from 'react';

interface TransactionType {
  id: string;
  email: string;
  transactionType: string;
  amount: number;
}

const Transaction = ({
  id,
  email,
  transactionType,
  amount,
}: TransactionType) => {
  return (
    <React.Fragment>
      <p>id: {id}</p>
      <p>email: {email}</p>
      <p>amount type: {transactionType}</p>
      <p>amount: {amount}</p>
      <br />
    </React.Fragment>
  );
};

export default Transaction;
