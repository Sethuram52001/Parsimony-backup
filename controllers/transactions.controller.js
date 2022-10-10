const {
  createTransactionRecord,
  deleteTransactionRecord,
  updateAccountBalances,
  updateTransactionRecord,
  getTransactionRecords,
  getTransactionByTimePeriod,
  updateAccountBalance,
  getTransactionByID,
  updateAccountBalanceOnDeletion,
} = require('../services/transactions.services');
const { getUser, updateUser } = require('../services/user.service');

const createTransaction = async (req, res) => {
  const { transactionType, amount, accounts, category, description } = req.body;
  try {
    const user = await getUser(req.user.id);
    const transactionAccount = accounts[0];
    const updatedAccountsList = updateAccountBalances(
      user,
      transactionAccount,
      amount,
      transactionType
    );

    await updateUser(user._id, updatedAccountsList);
    await createTransactionRecord(
      user._id,
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
    const user = await getUser(req.user.id);

    const transaction = await getTransactionByID(transactionId);
    const updatedAccountsList = updateAccountBalance(
      user,
      transaction.account,
      amount - transaction.amount
    );
    await updateUser(user._id, updatedAccountsList);

    await updateTransactionRecord(
      transactionId,
      transactionType,
      account,
      amount,
      category,
      description
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
    const user = await getUser(req.user.id);
    const transaction = await getTransactionByID(transactionId);
    const updatedAccountsList = updateAccountBalanceOnDeletion(
      user,
      transaction.account,
      transaction.transactionType,
      transaction.amount
    );
    await updateUser(user._id, updatedAccountsList);
    await deleteTransactionRecord(transactionId);
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
    const user = await getUser(req.user.id);
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
      user._id,
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
      user._id,
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
  const user = await getUser(req.user.id);
  try {
    const transactions = await getTransactionRecords(user._id);
    return res.status(200).json({ isError: false, transactions });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

const getTransactionsByDate = async (req, res) => {
  const user = await getUser(req.user.id);
  try {
    const transactions = await getTransactionByTimePeriod(user._id, req);
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
