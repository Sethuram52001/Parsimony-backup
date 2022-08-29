import { Card, Box, CardContent, Typography, Icon } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import moment from 'moment';

interface TransactionType {
  id: string;
  email: string;
  transactionType: string;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

const Transaction = ({
  id,
  email,
  transactionType,
  amount,
  category,
  description,
  createdAt,
}: TransactionType) => {
  return (
    <Card sx={{ maxWidth: 345, display: 'flex', mb: 5 }}>
      <Icon>
        <ShoppingCartIcon />
      </Icon>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            cash
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {amount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {moment(createdAt).fromNow()}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Transaction;
