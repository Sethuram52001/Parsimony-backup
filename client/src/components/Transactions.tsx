import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Transaction from './Transaction';

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  const getTransactions = async () => {
    const token = localStorage.getItem('token')!;
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };

    const response = await axios.get(
      'http://localhost:5000/api/transaction/get-transactions',
      config
    );
    const { transactions } = response.data;
    return transactions;
  };

  useEffect(() => {
    (async () => {
      const transactions = await getTransactions();
      setTransactions(transactions);
    })();
  }, []);

  return (
    <div>
      {transactions &&
        transactions.map((transaction) => (
          <Transaction
            key={transaction._id}
            id={transaction._id}
            email={transaction.email}
            transactionType={transaction.transactionType}
            amount={transaction.amount}
          />
        ))}
    </div>
  );
};

export default Transactions;
