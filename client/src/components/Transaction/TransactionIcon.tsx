import React from 'react';
import { Icon } from '@mui/material';
import * as Icons from '@mui/icons-material';

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

interface TransactionIconInterface {
  category: string;
}

const TransactionIcon = ({ category }: TransactionIconInterface) => {
  return (
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
  );
};

export default TransactionIcon;
