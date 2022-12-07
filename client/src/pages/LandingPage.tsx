import Grid from '@mui/material/Unstable_Grid2';
import { LottieDisplay } from '../components/LottieDisplay';
import ManWithLaptop from '../assets/lottie files/man-with-laptop.json';
import EventBudgetingBreakDown from '../assets/lottie files/event-budgeting-breakdown-hero.json';
import BusinessAnalytics from '../assets/lottie files/business-analytics.json';
import AnimationForWallet from '../assets/lottie files/animation-for-wallet.json';
import { Typography } from '@mui/material';

const LandingPage = () => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid container md={12}>
        <Grid container md={6}>
          <LottieDisplay lottieFile={ManWithLaptop} />
        </Grid>
        <Grid container md={6}>
          <Typography>Welcome to Parsimony,...</Typography>
        </Grid>
      </Grid>
      <Grid container md={12}>
        <Grid container md={6}>
          <Typography>
            You can plan and track your expenses blah blah
          </Typography>
        </Grid>
        <Grid container md={6}>
          <LottieDisplay lottieFile={EventBudgetingBreakDown} />
        </Grid>
      </Grid>
      <Grid container md={12}>
        <Grid container md={6}>
          <LottieDisplay lottieFile={BusinessAnalytics} />
        </Grid>
        <Grid container md={6}>
          <Typography>
            You can use analytics to view ur spendings blah blah
          </Typography>
        </Grid>
      </Grid>
      <Grid container md={12}>
        <Grid container md={6}>
          <Typography>You can manage accounts....</Typography>
        </Grid>
        <Grid container md={6}>
          <LottieDisplay lottieFile={AnimationForWallet} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LandingPage;
