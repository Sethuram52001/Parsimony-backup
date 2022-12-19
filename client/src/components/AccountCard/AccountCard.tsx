import { Card, CardContent, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface AccountCardProps {
  _id: string;
  accountName: string;
  balance: Number;
}

const AccountCard = ({ accountName, balance }: AccountCardProps) => {
  return (
    <Card sx={{ backgroundColor: 'aqua', minWidth: '250px', m: '5px' }}>
      <CardContent>
        <Typography variant="h5">account: {accountName}</Typography>
        <Typography variant="body2">
          balance: <>{balance}</>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
