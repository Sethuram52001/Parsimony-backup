import { Skeleton } from '@mui/material';
import { Fragment } from 'react';

const LoadingTransactions = () => {
  return (
    <Fragment>
      <Skeleton sx={{ maxWidth: 350, height: 100 }} />
    </Fragment>
  );
};

export default LoadingTransactions;
