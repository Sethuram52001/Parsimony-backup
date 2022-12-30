const moment = require('moment');
const Balance = require('../models/balance');
const { getUserAccounts } = require('../services/user.service');

const createBalanceRecord = async (userId) => {
  await Balance.create({
    userId,
    balances: new Array(12).fill(0),
  });
};

const getCurrentBalance = async (userId) => {
  const { accounts } = await getUserAccounts(userId);
  return accounts.reduce(
    (totalBalance, account) => totalBalance + account.balance,
    0
  );
};

const updateCurrentMonthBalance = async (userId) => {
  try {
    const currentBalance = await getCurrentBalance(userId);
    const balanceRecord = await Balance.findOne({ userId });
    const balances = balanceRecord.balances;
    balances[moment().month()] = currentBalance;
    await Balance.updateOne(
      {
        userId,
      },
      {
        balances,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createBalanceRecord,
  getCurrentBalance,
  updateCurrentMonthBalance,
};
