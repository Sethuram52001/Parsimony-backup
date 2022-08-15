const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accounts: {
      type: [accountSchema],
      validate: {
        validator: (accounts) => {
          const accountsSet = new Set(
            accounts.map((account) => account.accountName)
          );
          return accountsSet.size === accounts.length;
        },
        message: (account) => `Duplicate account: ${account.value}`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
