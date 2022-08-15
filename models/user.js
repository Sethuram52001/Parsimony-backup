const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
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
      minlength: 8,
    },
    accounts: [accountSchema],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
