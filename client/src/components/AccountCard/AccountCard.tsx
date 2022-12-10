import { Card, CardContent, Typography } from '@mui/material';

const AccountCard = () => {
  return (
    <Card sx={{ backgroundColor: 'aqua', minWidth: '250px', m: '5px' }}>
      <CardContent>
        <Typography variant="h5">account name</Typography>
        <Typography variant="body2">balance: 1000</Typography>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
