import TransactionCard from './TransactionCard';
import { default as api } from '../../store/apiSlice';

const TransactionsList = () => {
  let transactions;
  const { data, isFetching, isSuccess, isError } =
    api.useGetTransactionsQuery();
  if (isFetching) {
    console.log('fetching');
  } else if (isSuccess) {
    console.log(data);
    const { transactions: tx } = data;
    transactions = tx;
  } else if (isError) {
    console.log('error');
  }

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

export default TransactionsList;
