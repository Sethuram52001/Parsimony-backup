import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Transaction {
  _id: string;
  email: string;
  transactionType: string;
  account: string;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

interface Transactions {
  isError: Boolean;
  transactions: [Transaction];
}

const baseURI = 'http://localhost:5000';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURI,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')!;
      headers.set('x-auth-token', token);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query<Transactions, void>({
      query: () => '/api/transaction/get-transactions',
    }),
  }),
});

export default apiSlice;
