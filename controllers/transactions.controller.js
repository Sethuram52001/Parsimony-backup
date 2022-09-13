const moment = require('moment');
const Transaction = require('../models/transaction');
const User = require('../models/user');

const updateUser = async (_id, updatedAccountsList) => {
  await User.updateOne(
    {
      _id,
    },
    {
      accounts: updatedAccountsList,
    }
  );
};

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

const createTransaction = async (req, res) => {
  const { transactionType, amount, accounts, category, description } = req.body;
  try {
    const user = await User.findById(req.user.id).select('-password');
    const transactionAccount = accounts[0];
    const updatedAccountsList = updateAccountBalances(
      user,
      transactionAccount,
      amount,
      transactionType
    );

    await updateUser(user._id, updatedAccountsList);
    await createTransactionRecord(
      user.email,
      transactionType,
      transactionAccount,
      amount,
      category,
      description
    );

    return res.status(200).json({
      isError: false,
      message: 'Successfully created transaction record!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

const updateTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { transactionType, account, amount, category, description } = req.body;

  try {
    await Transaction.updateOne(
      {
        _id: transactionId,
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
    return res.status(200).json({
      isError: false,
      message: 'Successfully updated the transaction record!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
  try {
    await Transaction.deleteOne({
      _id: transactionId,
    });
    return res.status(200).json({
      isError: false,
      message: 'Successfully deleted the transaction record!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

const transferTypeTransaction = async (req, res) => {
  const { transactionType, amount, accounts, category, description } = req.body;
  try {
    const user = await User.findById(req.user.id).select('-password');
    const accountCredited = accounts[0];
    const accountDebited = accounts[1];
    const updatedAccountsListCredit = updateAccountBalances(
      user,
      accountCredited,
      amount,
      'expense'
    );

    await updateUser(user._id, updatedAccountsListCredit);
    await createTransactionRecord(
      user.email,
      transactionType,
      accountCredited,
      amount,
      category,
      description
    );

    const updatedAccountsListDebit = updateAccountBalances(
      user,
      accountDebited,
      amount,
      'income'
    );

    await updateUser(user._id, updatedAccountsListDebit);
    await createTransactionRecord(
      user.email,
      transactionType,
      accountDebited,
      amount,
      category,
      description
    );

    return res.status(200).json({
      isError: false,
      message: 'Successfully created transaction records!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

const getTransactions = async (req, res) => {
  const { email } = await User.findById(req.user.id).select('email');
  try {
    const transactions = await Transaction.find({ email })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json({ isError: false, transactions });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

const getTransactionsByDate = async (req, res) => {
  const { email } = await User.findById(req.user.id).select('email');
  const { timeSpan } = req.body;
  let fromDate, toDate;
  if (timeSpan === 'Day') {
    const { date } = req.body;
    fromDate = moment(date).set({ hour: 0, minute: 0, second: 0 });
    toDate = moment(fromDate).add(1, 'day');
  } else if (timeSpan === 'Month') {
    let { date: month } = req.body;
    month = moment().month(month).format('M') - 1;
    fromDate = moment().set({ month, date: 1, hour: 0, minute: 0, second: 0 });
    toDate = moment(fromDate).add(1, 'month');
  } else if (timeSpan === 'Year') {
    const { date: year } = req.body;
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

  try {
    const transactions = await Transaction.find({
      email,
      createdAt: {
        $gte: fromDate,
        $lt: toDate,
      },
    }).sort({ createdAt: 'desc' });
    return res.status(200).json({ isError: false, transactions });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  transferTypeTransaction,
  getTransactions,
  getTransactionsByDate,
};
