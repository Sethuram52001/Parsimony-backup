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
    <div style={{ marginLeft: '10px' }}>
      {transactions &&
        transactions.map((transaction) => (
          <Transaction
            key={transaction._id}
            transactionType={transaction.transactionType}
            amount={transaction.amount}
            category={transaction.category}
            description={transaction.description}
            createdAt={transaction.createdAt}
          />
        ))}
    </div>
  );
};

export default Transactions;
