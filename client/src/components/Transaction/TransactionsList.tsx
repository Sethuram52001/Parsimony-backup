import TransactionCard from './TransactionCard';
import { default as api } from '../../store/apiSlice';
import { useAppSelector as useSelector } from '../../hooks/hooks';

const TransactionsList = () => {
  const timeSpan = useSelector((state) => state.filter.timeSpan);
  const date = useSelector((state) => state.filter.date);
  let transactions;
  const { data, isFetching, isSuccess, isError } = api.useGetTransactionsQuery({
    timeSpan,
    date,
  });
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
