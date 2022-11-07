const moment = require('moment');
const Transaction = require('../models/transaction');

const createTransactionRecord = async (
  userId,
  transactionType,
  account,
  amount,
  category,
  description
) => {
  await Transaction.create({
    userId,
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

const getTransactionRecords = async (userId) => {
  return await Transaction.find({ userId }).sort({ createdAt: -1 }).exec();
};

const getTransactionByID = async (transactionId) => {
  const transaction = await Transaction.findOne({ _id: transactionId });
  return transaction;
};

const getTransactionByTimePeriod = async (userId, req) => {
  const { timeSpan } = req.query;
  if (!['Day', 'Month', 'Year'].includes(timeSpan)) {
    throw new Error('Time span is not defined or illeagal value for time span');
  }
  if (!req.query.date) {
    throw new Error('Date should be defined!');
  }
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
    userId,
    createdAt: {
      $gte: fromDate,
      $lt: toDate,
    },
  }).sort({ createdAt: 'desc' });
};

const updateAccountBalance = (user, transactionAccount, updatedAmount) => {
  const updatedAccountsList = user.accounts;
  for (const account of updatedAccountsList) {
    if (account.accountName === transactionAccount) {
      account.balance += updatedAmount;
      break;
    }
  }

  return updatedAccountsList;
};

const updateAccountBalanceOnDeletion = (
  user,
  transactionAccount,
  transactionType,
  amount
) => {
  const updatedAccountsList = user.accounts;
  for (const account of updatedAccountsList) {
    if (account.accountName === transactionAccount) {
      account.balance += transactionType === 'expense' ? amount : -amount;
      break;
    }
  }

  return updatedAccountsList;
};

const updateAccountBalanceOnAccountChange = (
  user,
  oldAccount,
  updatedAccount,
  transactionType,
  amount
) => {
  const updatedAccountsList = user.accounts;
  let updatedOldAccount = false;
  let updatedNewAccount = false;
  for (const account of updatedAccountsList) {
    if (updatedOldAccount && updatedNewAccount) {
      break;
    }
    if (account.accountName === oldAccount) {
      account.balance += transactionType === 'expense' ? amount : -amount;
      updatedOldAccount = true;
    } else if (account.accountName === updatedAccount) {
      account.balance += transactionType === 'expense' ? -amount : amount;
      updatedNewAccount = true;
    }
  }
  return updatedAccountsList;
};

module.exports = {
  createTransactionRecord,
  deleteTransactionRecord,
  updateAccountBalances,
  updateTransactionRecord,
  getTransactionRecords,
  getTransactionByID,
  getTransactionByTimePeriod,
  updateAccountBalance,
  updateAccountBalanceOnDeletion,
  updateAccountBalanceOnAccountChange,
};
