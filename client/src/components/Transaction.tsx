import { Card, Box, CardContent, Typography, Icon } from '@mui/material';
import * as Icons from '@mui/icons-material';
import moment from 'moment';
import React from 'react';

interface TransactionType {
  transactionType: string;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

interface iconMappingType {
  [key: string]: any;
}

const iconMapping: iconMappingType = {
  'Food and Drinks': ['Fastfood', '#FF5733'],
  Shopping: ['ShoppingCart', '#00CFCF'],
  Housing: ['Home', '#FF9F00'],
  Transportation: ['Commute', '#30873B'],
  'Life & Entertainment': ['Nightlife', '#672595'],
  'Communication, PC': ['LocalPhone', '#0059FF'],
  'Financial expenses': ['Money', '#33FF00'],
  Investments: ['CurrencyExchange', '#C70039'],
  Income: ['AccountBalance', '#FFC300'],
  Others: ['Menu', '#5D5F5D'],
};

const Transaction = ({
  transactionType,
  amount,
  category,
  description,
  createdAt,
}: TransactionType) => {
  const transactionTypeColor =
    transactionType === 'transfer'
      ? 'text.secondary'
      : transactionType === 'expense'
      ? 'red'
      : 'green';

  return (
    <Card sx={{ maxWidth: 345, display: 'flex', mb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          m: '10px',
        }}
      >
        <Icon
          sx={{
            background: iconMapping[category][1],
            color: '#FFF',
            borderRadius: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          fontSize="large"
        >
          {React.createElement(
            Icons[iconMapping[category][0] as keyof typeof Icons]
          )}
        </Icon>
      </Box>
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
          <Typography variant="body2" color={transactionTypeColor}>
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
