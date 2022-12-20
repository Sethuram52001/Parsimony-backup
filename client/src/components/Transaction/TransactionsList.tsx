import TransactionCard from './TransactionCard';
import { LoadingTransactions } from '../Loading';

interface Transaction {
  _id: string;
  transactionType: string;
  account: string;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList = (transactions: TransactionsListProps) => {
  return (
    <div style={{ marginLeft: '10px' }}>
      {transactions &&
        transactions.transactions.map((transaction: Transaction) => (
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

export default TransactionsList;
