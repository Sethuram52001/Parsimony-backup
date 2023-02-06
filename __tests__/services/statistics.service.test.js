const {
  createBalanceRecord,
  getCurrentBalance,
  updateCurrentMonthBalance,
} = require('../../services/statistics.service');
const { createUser, findUser } = require('../../services/user.service');
const { connectDB, disconnectDB } = require('./../db/index');
const Balance = require('../../models/balance');
const moment = require('moment');

const testUser = {
  email: 'test@gmail.com',
  name: 'test',
  password: 'test',
  accounts: [
    {
      accountName: 'gpay',
      balance: 10000,
    },
  ],
};
let userID;

const testTransaction = {
  transactionType: 'income',
  amount: 3500,
  category: 'Income',
  accounts: ['bank'],
};

beforeAll(async () => {
  await connectDB();
  await createUser(testUser);
  const res = await findUser('test@gmail.com');
  userID = res._id;
  testTransaction.userId = userID;
});

afterAll(async () => {
  await disconnectDB();
});

describe('createBalanceRecord', () => {
  it('should create 12 0 balance records', async () => {
    await createBalanceRecord(userID);
    const res = await Balance.find({ userId: userID });
    expect(res[0].balances.length).toBe(12);
    expect(res[0].balances[0]).toBe(0);
  });
});

describe('getCurrentBalance', () => {
  it('should get current balance of the user', async () => {
    const currentBalance = await getCurrentBalance(userID);
    const expectedBalance = testUser.accounts.reduce(
      (totalBalance, account) => totalBalance + account.balance,
      0
    );
    expect(currentBalance).toBe(expectedBalance);
  });
});

describe('updateCurrentMonthBalance', () => {
  it('should update current balance for month', async () => {
    await updateCurrentMonthBalance(userID);
    const month = moment().month();
    const balanceRecord = await Balance.find({ userId: userID });
    const expectedBalance = testUser.accounts.reduce(
      (totalBalance, account) => totalBalance + account.balance,
      0
    );
    expect(balanceRecord[0].balances[month]).toBe(expectedBalance);
  });
});
