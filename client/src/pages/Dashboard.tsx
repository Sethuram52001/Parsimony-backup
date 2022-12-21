import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import AccountCard from '../components/AccountCard/AccountCard';
import { DoughnetStat } from '../components/Statistics';
import TransactionsList from '../components/Transaction/TransactionsList';
import { default as api } from '../store/apiSlice';
import { LoadingTransactions } from '../components';

const Dashboard = () => {
  let accounts;
  const { data, isFetching, isSuccess, isError } = api.useGetUserDetailsQuery();
  if (isFetching) {
    console.log('fetching');
  } else if (isSuccess) {
    console.log(data);
    const { user } = data;
    accounts = user.accounts;
  } else if (isError) {
    console.log('error');
  }

  let transactions;
  const {
    data: transactionsData,
    isFetching: transactionsDataFetching,
    isSuccess: transactionsDataSuccess,
    isError: transactionsDataError,
  } = api.useGetTransactionsQuery();
  if (transactionsDataFetching) {
    console.log('fetching transactional data');
  } else if (transactionsDataSuccess) {
    console.log(transactionsData);
    transactions = transactionsData.transactions;
  } else if (transactionsDataError) {
    console.log('error in fetching transactional data');
  }

  return (
    <Grid sx={{ height: '100vh' }}>
      <Grid container md={12}>
        <Grid container xs={12}>
          <Typography variant="h5">Your accounts</Typography>
        </Grid>
        <Grid container xs={12}>
          {isFetching
            ? Array.from(new Array(3)).map((item) => <LoadingTransactions />)
            : accounts &&
              accounts.map((account, idx) => <AccountCard {...account} />)}
        </Grid>
      </Grid>
      <Grid container md={12}>
        <Grid container xs={12}>
          <Typography variant="h5">Expense graphic</Typography>
        </Grid>
        <Grid container xs={12}>
          <DoughnetStat />
        </Grid>
      </Grid>
      <Grid container>
        <Grid container xs={12} md={6}>
          <Grid container xs={12}>
            <Typography variant="h5">Your past transactions</Typography>
          </Grid>
          <Grid container xs={12}>
            {isFetching
              ? Array.from(new Array(3)).map((item) => <LoadingTransactions />)
              : transactions && (
                  <TransactionsList transactions={transactions} />
                )}
          </Grid>
        </Grid>
        <Grid container xs={12} md={6}>
          <Grid container xs={12}>
            <Typography variant="h5">Upcoming payments</Typography>
          </Grid>
          <Grid container xs={12}>
            {isFetching
              ? Array.from(new Array(3)).map((item) => <LoadingTransactions />)
              : transactions && (
                  <TransactionsList transactions={transactions} />
                )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
