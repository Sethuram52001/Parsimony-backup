import { Card, Box, CardContent, Typography } from '@mui/material';
import TransactionIcon from './TransactionIcon';
import moment from 'moment';

interface TransactionCardInterface {
  transactionType: string;
  amount: number;
  account: string;
  category: string;
  description: string;
  createdAt: string;
}

const TransactionCard = ({
  transactionType,
  amount,
  account,
  category,
  description,
  createdAt,
}: TransactionCardInterface) => {
  const transactionTypeColor =
    transactionType === 'transfer'
      ? 'text.secondary'
      : transactionType === 'expense'
      ? 'red'
      : 'green';

  return (
    <Card sx={{ maxWidth: 350, display: 'flex', mb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          m: '10px',
        }}
      >
        <TransactionIcon category={category} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          m: '10px',
        }}
      >
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {account}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          m: '10px',
        }}
      >
        <CardContent>
          <Typography variant="body2" color={transactionTypeColor}>
            {amount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {moment(createdAt).calendar()}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default TransactionCard;
