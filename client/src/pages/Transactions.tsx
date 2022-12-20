import * as React from 'react';
import { default as api } from '../store/apiSlice';
import { useAppSelector as useSelector } from '../hooks/hooks';
import { TransactionsList, Filter } from '../components';

const Transactions = () => {
  const timeSpan = useSelector((state) => state.filter.timeSpan);
  const date = useSelector((state) => state.filter.date);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const { data, isFetching, isSuccess, isError } =
    api.useGetTransactionsByDateQuery({
      timeSpan,
      date,
    });

  if (isFetching) {
    console.log('fetching');
  } else if (isSuccess) {
    const { transactions: tx } = data;
    if (tx !== transactions) {
      setTransactions(tx);
    }
    console.log(tx);
    console.log(transactions);
  } else if (isError) {
    console.log('error');
  }

  return (
    <React.Fragment>
      <h1>Transactions</h1>
      <Filter />
      {isSuccess ? (
        transactions && <TransactionsList transactions={transactions} />
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default Transactions;
