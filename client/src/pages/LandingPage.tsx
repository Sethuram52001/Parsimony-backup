import Grid from '@mui/material/Unstable_Grid2';
import { LottieDisplay } from '../components/LottieDisplay';
import ManWithLaptop from '../assets/lottie files/man-with-laptop.json';
import EventBudgetingBreakDown from '../assets/lottie files/event-budgeting-breakdown-hero.json';
import BusinessAnalytics from '../assets/lottie files/business-analytics.json';
import AnimationForWallet from '../assets/lottie files/animation-for-wallet.json';
import { Typography } from '@mui/material';
import { Footer } from '../components';

const LandingPage = () => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid container md={12}>
        <Grid container xs={12} md={6}>
          <LottieDisplay lottieFile={ManWithLaptop} />
        </Grid>
        <Grid container xs={12} md={6} sx={{ alignItems: 'center' }}>
          <Typography align="justify">
            Welcome to Parsimony, Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </Typography>
        </Grid>
      </Grid>
      <Grid container md={12}>
        <Grid
          container
          xs={12}
          md={6}
          sx={{ alignItems: 'center' }}
          order={{ xs: 2, md: 1 }}
        >
          <Typography>
            You can plan and track your expenses, Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </Typography>
        </Grid>
        <Grid container xs={12} md={6} order={{ xs: 1, md: 2 }}>
          <LottieDisplay lottieFile={EventBudgetingBreakDown} />
        </Grid>
      </Grid>
      <Grid container md={12}>
        <Grid container xs={12} md={6}>
          <LottieDisplay lottieFile={BusinessAnalytics} />
        </Grid>
        <Grid container xs={12} md={6} sx={{ alignItems: 'center' }}>
          <Typography>
            You can use analytics to view ur spendings, Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </Typography>
        </Grid>
      </Grid>
      <Grid container md={12}>
        <Grid
          container
          xs={12}
          md={6}
          sx={{ alignItems: 'center' }}
          order={{ xs: 2, md: 1 }}
        >
          <Typography>
            You can manage accounts, Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </Typography>
        </Grid>
        <Grid container xs={12} md={6} order={{ xs: 1, md: 2 }}>
          <LottieDisplay lottieFile={AnimationForWallet} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LandingPage;
