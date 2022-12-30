const Balance = require('../models/balance');

const createBalanceRecord = async (userId) => {
  await Balance.create({
    userId,
    balances: new Array(12).fill(0),
  });
};

module.exports = {
  createBalanceRecord,
};
