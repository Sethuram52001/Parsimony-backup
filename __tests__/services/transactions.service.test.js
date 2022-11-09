const mongoose = require('mongoose');
const { getMockReq } = require('@jest-mock/express');
const Transaction = require('../../models/transaction');
const { connectDB, disconnectDB } = require('./../db/index');
const { createUser, findUser } = require('../../services/user.service');
const {
  createTransactionRecord,
  getTransactionByID,
  getTransactionRecords,
  getTransactionByTimePeriod,
  deleteTransactionRecord,
  updateAccountBalance,
  updateAccountBalanceOnDeletion,
  updateAccountBalanceOnAccountChange,
  updateAccountBalances,
  updateTransactionRecord,
} = require('../../services/transactions.services');

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
let transactionID;
const fakeID = '000000000000000000000000';

beforeAll(async () => {
  await connectDB();
  await createUser(testUser);
  const res = await findUser('test@gmail.com');
  userID = JSON.stringify(res._id);
  testTransaction.userId = userID;
});

afterAll(async () => {
  await disconnectDB();
});

describe('create transaction service', () => {
  it('should create transaction successfully when provided with proper details without description', async () => {
    const { userId, transactionType, accounts, amount, category } =
      testTransaction;
    const transactionAccount = accounts[0];
    await createTransactionRecord(
      userId,
      transactionType,
      transactionAccount,
      amount,
      category
    );
    const res = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    const transaction = res[0];
    expect(res.length).toBe(1);
    expect(transaction._id).toBeDefined();
    expect(transaction.userId).toEqual(testTransaction.userId);
    expect(transaction.transactionType).toEqual(
      testTransaction.transactionType
    );
    expect(transaction.transactionAccount).toEqual(
      testTransaction.transactionAccount
    );
    expect(transaction.amount).toEqual(testTransaction.amount);
    expect(transaction.category).toEqual(testTransaction.category);
  });

  it('should create transaction successfully when provided with proper details with description', async () => {
    const { userId, transactionType, accounts, amount, category } =
      testTransaction;
    const transactionAccount = accounts[0];
    const description = 'Sample transaction description';
    await createTransactionRecord(
      userId,
      transactionType,
      transactionAccount,
      amount,
      category,
      description
    );
    const res = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    const transaction = res[0];
    expect(res.length).toBe(2);
    expect(transaction._id).toBeDefined();
    expect(transaction.userId).toEqual(testTransaction.userId);
    expect(transaction.transactionType).toEqual(
      testTransaction.transactionType
    );
    expect(transaction.transactionAccount).toEqual(
      testTransaction.transactionAccount
    );
    expect(transaction.amount).toEqual(testTransaction.amount);
    expect(transaction.category).toEqual(testTransaction.category);
    expect(transaction.description).toEqual(description);
  });

  it('shouldnt create transaction successfully when not provided with proper details', async () => {
    const { transactionType, accounts, amount, category } = testTransaction;
    const transactionAccount = accounts[0];
    let err;
    try {
      await createTransactionRecord(
        transactionType,
        transactionAccount,
        amount,
        category
      );
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('shouldnt create transaction successfully when not provided with proper details', async () => {
    const { userId, accounts, amount, category } = testTransaction;
    const transactionAccount = accounts[0];
    let err;
    try {
      await createTransactionRecord(
        userId,
        transactionAccount,
        amount,
        category
      );
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  //
  it('shouldnt create transaction successfully when not provided with proper details', async () => {
    const { userId, transactionType, amount, category } = testTransaction;
    let err;
    try {
      await createTransactionRecord(userId, transactionType, amount, category);
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('shouldnt create transaction successfully when not provided with proper details', async () => {
    const { userId, transactionType, accounts, category } = testTransaction;
    const transactionAccount = accounts[0];
    let err;
    try {
      await createTransactionRecord(
        userId,
        transactionType,
        transactionAccount,
        category
      );
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('shouldnt create transaction successfully when not provided with proper details', async () => {
    const { userId, transactionType, accounts, amount } = testTransaction;
    const transactionAccount = accounts[0];
    let err;
    try {
      await createTransactionRecord(
        userId,
        transactionType,
        transactionAccount,
        amount
      );
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});

describe('Get transaction by user id service', () => {
  it('should return transaction records of the user when provided with proper id', async () => {
    const res = await getTransactionRecords(userID);
    const expectedRes = await Transaction.find({ userID })
      .sort({ createdAt: -1 })
      .exec();
    transactionID = expectedRes[0]._id;
    expect(res.length).toBe(expectedRes.length);
    expect(res).toEqual(expectedRes);
  });

  it('should not return transaction records of the user when not provided with proper id', async () => {
    const res = await getTransactionRecords(fakeID);
    expect(res.length).toBe(0);
  });
});

describe('Get transaction by id service', () => {
  it('should get the correct transaction record when provided with transaction id', async () => {
    const res = await getTransactionByID(transactionID);
    const expectedRes = await Transaction.findOne({ _id: transactionID });
    expect(res).toEqual(expectedRes);
  });

  it('should return null when provided with invalid transaction id', async () => {
    const fakeID = '000000000000000000000000';
    const res = await getTransactionByID(fakeID);
    expect(res).toBe(null);
  });
});

describe('Get transaction by time period', () => {
  it('should throw error if timespan is not defined', async () => {
    let err;
    const req = getMockReq({
      query: { date: 2022 },
    });

    try {
      await getTransactionByTimePeriod(userID, req);
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(Error);
  });

  it('should throw error if timespan contains illegal value', async () => {
    let err;
    const req = getMockReq({
      query: { timeSpan: 'Yer', date: 2022 },
    });

    try {
      await getTransactionByTimePeriod(userID, req);
    } catch (error) {
      err = error;
    }
    expect(err).toMatchObject(
      new Error('Time span is not defined or illeagal value for time span')
    );
  });

  it('should throw error if date is not defined', async () => {
    let err;
    const req = getMockReq({
      query: { timeSpan: 'Year' },
    });

    try {
      await getTransactionByTimePeriod(userID, req);
    } catch (error) {
      err = error;
    }
    expect(err).toMatchObject(new Error('Date should be defined!'));
  });

  it('should return 0 transactions', async () => {
    const req = getMockReq({
      query: {
        timeSpan: 'Year',
        date: new Date().getFullYear() + 1,
      },
    });

    const res = await getTransactionByTimePeriod(userID, req);
    expect(res.length).toBe(0);
  });

  it('should return 0 transactions', async () => {
    const req = getMockReq({
      query: {
        timeSpan: 'Month',
        date: new Date().getMonth() - 1,
      },
    });

    const res = await getTransactionByTimePeriod(userID, req);
    expect(res.length).toBe(0);
  });

  it('should return 0 transactions', async () => {
    const req = getMockReq({
      query: {
        timeSpan: 'Day',
        date: new Date().getDate() - 1,
      },
    });

    const res = await getTransactionByTimePeriod(userID, req);
    expect(res.length).toBe(0);
  });

  it('should return 2 transactions', async () => {
    const req = getMockReq({
      query: {
        timeSpan: 'Year',
        date: new Date().getFullYear(),
      },
    });

    const res = await getTransactionRecords(userID, req);
    expect(res.length).toBe(2);
  });

  it('should return 2 transactions', async () => {
    const req = getMockReq({
      query: {
        timeSpan: 'Month',
        date: new Date().getMonth(),
      },
    });

    const res = await getTransactionByTimePeriod(userID, req);
    expect(res.length).toBe(2);
  });

  it('should return 2 transactions', async () => {
    const req = getMockReq({
      query: {
        timeSpan: 'Day',
        date: new Date(),
      },
    });

    const res = await getTransactionByTimePeriod(userID, req);
    expect(res.length).toBe(2);
  });
});

describe('Delete transaction service', () => {
  it('should throw error when provided with invalid transaction id', async () => {
    await deleteTransactionRecord(transactionID);

    const res = await getTransactionByID(transactionID);
    expect(res).toBe(null);
  });
});

describe('Update account balance service', () => {
  let testUser2;
  beforeEach(() => {
    testUser2 = JSON.parse(JSON.stringify(testUser));
  });

  it('should update account balance of the transaction account of the user', () => {
    const res = updateAccountBalance(testUser2, 'gpay', 1000);
    expect(res[0].balance).toBe(11000);
  });
});

describe('Update account balance on deletion', () => {
  let testUser2;
  beforeEach(() => {
    testUser2 = JSON.parse(JSON.stringify(testUser));
  });

  it('should update account balance of the transaction account of the user on deletion of transaction', () => {
    const res = updateAccountBalanceOnDeletion(
      testUser2,
      'gpay',
      'income',
      1000
    );
    expect(res[0].balance).toBe(9000);
  });

  it('should update account balance of the transaction account of the user on deletion of transaction', () => {
    const res = updateAccountBalanceOnDeletion(
      testUser2,
      'gpay',
      'expense',
      1000
    );
    expect(res[0].balance).toBe(11000);
  });
});

describe('Update account balance on account change service', () => {
  let testUser2;
  beforeEach(() => {
    testUser2 = {
      email: 'test@gmail.com',
      name: 'test',
      password: 'test',
      accounts: [
        {
          accountName: 'gpay',
          balance: 10000,
        },
        {
          accountName: 'bank',
          balance: 20000,
        },
      ],
    };
  });

  it('should update account balance on account change', () => {
    const res = updateAccountBalanceOnAccountChange(
      testUser2,
      'gpay',
      'bank',
      'income',
      1000
    );
    expect(res[0].balance).toBe(9000);
    expect(res[1].balance).toBe(21000);
  });

  it('should update account balance on account change', () => {
    const res = updateAccountBalanceOnAccountChange(
      testUser2,
      'gpay',
      'bank',
      'expense',
      1000
    );
    expect(res[0].balance).toBe(11000);
    expect(res[1].balance).toBe(19000);
  });
});

describe('Update account balances service', () => {
  let testUser2;
  beforeEach(() => {
    testUser2 = JSON.parse(JSON.stringify(testUser));
  });

  it('should update account balance', () => {
    const res = updateAccountBalances(testUser2, 'gpay', 5000, 'income');
    expect(res[0].balance).toBe(15000);
  });

  it('should update account balance', () => {
    const res = updateAccountBalances(testUser2, 'gpay', 5000, 'expense');
    expect(res[0].balance).toBe(5000);
  });
});

describe('Update transaction record service', () => {
  beforeEach(async () => {
    const { userId, transactionType, accounts, amount, category } =
      testTransaction;
    const transactionAccount = accounts[0];
    await createTransactionRecord(
      userId,
      transactionType,
      transactionAccount,
      amount,
      category,
      'Initial transaction'
    );
    const res = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    transactionID = res[0]._id;
  });

  it('should update transaction record on creation of a transaction', async () => {
    await updateTransactionRecord(
      transactionID,
      'income',
      'gpay',
      5000,
      'Income',
      'Updated transaction record'
    );
    const res = await getTransactionByID(transactionID);
    expect(res._id).toBeDefined();
    expect(res.transactionType).toEqual('income');
    expect(res.account).toEqual('gpay');
    expect(res.amount).toEqual(5000);
    expect(res.category).toEqual('Income');
    expect(res.description).toEqual('Updated transaction record');
  });

  it('should update transaction record on creation of a transaction', async () => {
    await updateTransactionRecord(
      transactionID,
      'expense',
      'bank',
      15000,
      'Shopping'
    );
    const res = await getTransactionByID(transactionID);
    expect(res._id).toBeDefined();
    expect(res.transactionType).toBe('expense');
    expect(res.account).toBe('bank');
    expect(res.amount).toBe(15000);
    expect(res.category).toBe('Shopping');
    expect(res.description).toBe('Initial transaction');
  });
});
