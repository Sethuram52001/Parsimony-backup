const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    balances: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Balance = mongoose.model('Balance', balanceSchema, 'balance');
module.exports = Balance;
