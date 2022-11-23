const { getMockReq } = require('@jest-mock/express');
const { mockResponse } = require('../../utils/interceptor');
const { connectDB, disconnectDB } = require('../db');
const {
  createTransaction,
  deleteTransaction,
} = require('../../controllers/transactions.controller');
const { createUser, findUser } = require('../../services/user.service');
const {
  createTransactionRecord,
  getTransactionRecords,
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

let testUserID, testTransactionID;

beforeAll(async () => {
  await connectDB();
  await createUser(testUser);
  let res = await findUser('test@gmail.com');
  testUserID = res._id;
  await createTransactionRecord(
    testUserID,
    'expense',
    'gpay',
    500,
    'Shopping',
    ''
  );
  res = await getTransactionRecords(testUserID);
  testTransactionID = res[0]._id;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Create transaction controller', () => {
  it('should return failure message on providing invalid user', async () => {
    const req = getMockReq({
      user: {
        id: '000000000000000000000000',
      },
      body: {
        transactionType: 'income',
        amount: 1000,
        category: 'Income',
        accounts: ['bank'], // bank is not present test user, throws error
      },
    });

    const res = mockResponse();

    await createTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return failure message on providing invalid details', async () => {
    const req = getMockReq({
      user: {
        id: testUserID,
      },
      body: {
        transactionType: 'income',
        amount: 1000,
        category: 'Income',
        accounts: ['bank'], // bank is not present test user, throws error
      },
    });

    const res = mockResponse();

    await createTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return success message on providing valid details', async () => {
    const req = getMockReq({
      user: {
        id: testUserID,
      },
      body: {
        transactionType: 'income',
        amount: 1000,
        category: 'Income',
        accounts: ['gpay'],
      },
    });

    const res = mockResponse();

    await createTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      message: 'Successfully created transaction record!',
    });
  });
});

describe('Delete transaction controller', () => {
  it('should return success message on providing valid transaction id', async () => {
    const req = getMockReq({
      user: {
        id: testUserID,
      },
      params: {
        transactionId: testTransactionID,
      },
    });

    const res = mockResponse();
    await deleteTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      message: 'Successfully deleted the transaction record!',
    });
  });
});
