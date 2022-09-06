import axios from 'axios';
import { useState, useEffect } from 'react';
import TransactionCard from './TransactionCard';

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  const getTransactions = async () => {
    const token = localStorage.getItem('token')!;
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };

    const res = await axios.get(
      'http://localhost:5000/api/transaction/get-transactions',
      config
    );
    const { transactions } = res.data;
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
          <TransactionCard
            key={transaction._id}
            transactionType={transaction.transactionType}
            account={transaction.account}
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
