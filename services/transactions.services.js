const moment = require('moment');
const Transaction = require('../models/transaction');

const createTransactionRecord = async (
  email,
  transactionType,
  account,
  amount,
  category,
  description
) => {
  await Transaction.create({
    email,
    transactionType,
    account,
    amount,
    category,
    description,
  });
};

const deleteTransactionRecord = async (_id) => {
  await Transaction.deleteOne({
    _id,
  });
};

const updateAccountBalances = (
  user,
  transactionAccount,
  amount,
  transactionType
) => {
  const accountToBeUpdated = user.accounts.filter(
    (account) => account.accountName === transactionAccount
  )[0];
  let updatedBalance = accountToBeUpdated.balance;
  updatedBalance += transactionType === 'expense' ? -amount : amount;
  const updatedAccountsList = user.accounts;

  for (const account of updatedAccountsList) {
    if (account.accountName === transactionAccount) {
      account.balance = updatedBalance;
      break;
    }
  }

  return updatedAccountsList;
};

const updateTransactionRecord = async (
  _id,
  transactionType,
  account,
  amount,
  category,
  description
) => {
  await Transaction.updateOne(
    {
      _id,
    },
    {
      transactionType,
      account,
      amount,
      category,
      description,
    },
    {
      runValidators: true,
    }
  );
};

const getTransactionRecords = async (email) => {
  return await Transaction.find({ email }).sort({ createdAt: -1 }).exec();
};

const getTransactionByTimePeriod = async (email, req) => {
  const { timeSpan } = req.query;
  let fromDate, toDate;
  if (timeSpan === 'Day') {
    const { date } = req.query;
    fromDate = moment(date).set({ hour: 0, minute: 0, second: 0 });
    toDate = moment(fromDate).add(1, 'day');
  } else if (timeSpan === 'Month') {
    let { date: month } = req.query;
    month = moment().month(month).format('M') - 1;
    fromDate = moment().set({ month, date: 1, hour: 0, minute: 0, second: 0 });
    toDate = moment(fromDate).add(1, 'month');
  } else if (timeSpan === 'Year') {
    const { date: year } = req.query;
    fromDate = moment().set({
      year,
      month: 0,
      date: 1,
      hour: 0,
      minute: 0,
      second: 0,
    });
    toDate = moment(fromDate).add(1, 'year');
  }

  return await Transaction.find({
    email,
    createdAt: {
      $gte: fromDate,
      $lt: toDate,
    },
  }).sort({ createdAt: 'desc' });
};

module.exports = {
  createTransactionRecord,
  deleteTransactionRecord,
  updateAccountBalances,
  updateTransactionRecord,
  getTransactionRecords,
  getTransactionByTimePeriod,
};
