const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      enum: {
        values: ['income', 'expense', 'transfer'],
        message: '{VALUE} is not supported',
      },
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      min: [0, 'Must be at least 0, got {VALUE}'],
    },
    category: {
      type: String,
      enum: {
        values: [
          'Food and Drinks',
          'Shopping',
          'Housing',
          'Transportation',
          'Life & Entertainment',
          'Communication, PC',
          'Financial expenses',
          'Investments',
          'Income',
          'Others',
        ],
        message: '{VALUE} is not supported',
      },
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  'Transaction',
  transactionSchema,
  'transactions'
);
module.exports = Transaction;
