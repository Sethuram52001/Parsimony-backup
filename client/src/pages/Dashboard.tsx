import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import AccountCard from '../components/AccountCard/AccountCard';
import { DoughnetStat } from '../components/Statistics';
import TransactionsList from '../components/Transaction/TransactionsList';

const Dashboard = () => {
  const accounts = [1, 2, 3];
  return (
    <Grid sx={{ height: '100vh' }}>
      <Grid container md={12}>
        <Grid container xs={12}>
          <Typography variant="h5">Your accounts</Typography>
        </Grid>
        <Grid container xs={12}>
          {accounts.map((account, idx) => (
            <AccountCard key={idx} />
          ))}
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
            <TransactionsList />
          </Grid>
        </Grid>
        <Grid container xs={12} md={6}>
          <Grid container xs={12}>
            <Typography variant="h5">Upcoming payments</Typography>
          </Grid>
          <Grid container xs={12}>
            <TransactionsList />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
