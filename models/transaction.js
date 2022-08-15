const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    email: {
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
    amount: {
      type: Number,
      min: [0, 'Must be at least 0, got {VALUE}'],
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
