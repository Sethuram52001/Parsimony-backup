const { getMockReq } = require('@jest-mock/express');
const { mockResponse } = require('../../utils/interceptor');
const { connectDB, disconnectDB } = require('../db');
const {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  transferTypeTransaction,
  getTransactions,
  getTransactionsByDate,
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
    {
      accountName: 'bank',
      balance: 5000,
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
        accounts: ['bank'],
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
        accounts: ['bank1'], // bank is not present test user, throws error
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

describe('Update transaction controller', () => {
  it('should return failure message on not providing user id', async () => {
    const req = getMockReq({
      params: {
        transactionId: testTransactionID,
      },
      body: {
        amount: 5000,
      },
    });

    const res = mockResponse();
    await updateTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return failure message on providing invalid user', async () => {
    const req = getMockReq({
      user: {
        id: '000000000000000000000000',
      },
      params: {
        transactionId: testTransactionID,
      },
      body: {
        amount: 5000,
      },
    });

    const res = mockResponse();
    await updateTransaction(req, res);

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
      params: {
        transactionId: testTransactionID,
      },
      body: {
        amount: 5000,
      },
    });

    const res = mockResponse();
    await updateTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      message: 'Successfully updated the transaction record!',
    });
  });
});

describe('Delete transaction controller', () => {
  it('should return failure message on not providing user id', async () => {
    const req = getMockReq({
      params: {
        transactionId: testTransactionID,
      },
    });

    const res = mockResponse();
    await deleteTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

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

describe('Transfer type transaction controller', () => {
  it('should return failure message when user id is not provided', async () => {
    const req = getMockReq({
      body: {
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank', 'gpay'],
        category: 'Others',
      },
    });

    const res = mockResponse();
    await transferTypeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return failure message when invalid user id is provided', async () => {
    const req = getMockReq({
      user: {
        id: '000000000000000000000000',
      },
      body: {
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank', 'gpay'],
        category: 'Others',
      },
    });

    const res = mockResponse();
    await transferTypeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return failure message when invalid number of accounts is provided', async () => {
    const req = getMockReq({
      user: {
        id: testUserID,
      },
      body: {
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank'],
        category: 'Others',
      },
    });

    const res = mockResponse();
    await transferTypeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: new Error(
        '2 accounts must be selected to perform a transfer type transaction'
      ),
    });
  });

  it('should return failure message when amount is not provided', async () => {
    const req = getMockReq({
      user: {
        id: testUserID,
      },
      body: {
        transactionType: 'transfer',
        accounts: ['bank', 'gpay'],
        category: 'Others',
      },
    });

    const res = mockResponse();
    await transferTypeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: new Error(
        'Amount must be defined to create a transfer type transaction'
      ),
    });
  });

  it('should return success message when provided with valid details', async () => {
    const req = getMockReq({
      user: {
        id: testUserID,
      },
      body: {
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank', 'gpay'],
        category: 'Others',
      },
    });

    const res = mockResponse();
    await transferTypeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      message: 'Successfully created transaction records!',
    });
  });
});

describe('Get transactions controller', () => {
  it('should return failure message when user id is not provided', async () => {
    const req = getMockReq({});
    const res = mockResponse();
    await getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return failure message when invalid user id is provided', async () => {
    const req = getMockReq({
      user: {
        id: '000000000000000000000000',
      },
    });

    const res = mockResponse();
    await getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return success message when provided with valid user id', async () => {
    const req = getMockReq({
      user: {
        id: testUserID,
      },
    });
    const res = mockResponse();
    await getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      transactions: expect.any(Array),
    });
  });
});

describe('Get transactions by date controller', () => {
  it('should return failure message when user id is not provided', async () => {
    const req = getMockReq({});
    const res = mockResponse();
    await getTransactionsByDate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return failure message when invalid user id is provided', async () => {
    const req = getMockReq({
      user: {
        id: '000000000000000000000000',
      },
    });

    const res = mockResponse();
    await getTransactionsByDate(req, res);

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
      query: {
        timeSpan: 'Year',
        date: 2022,
      },
    });

    const res = mockResponse();
    await getTransactionsByDate(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      transactions: expect.any(Array),
    });
  });
});
