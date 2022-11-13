const { connectDB, disconnectDB } = require('./../db/');
const request = require('supertest');
const moment = require('moment');
const app = require('../../server');

let token, transactionID;
const testTransaction = {
  transactionType: 'income',
  amount: 3500,
  category: 'Income',
  accounts: ['bank'],
};

beforeAll(async () => {
  await connectDB();
  let res = await request(app)
    .post('/api/user/register')
    .send({
      email: 'transactionTest@gmail.com',
      name: 'transactionTest',
      password: 'transactionTest',
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
    });

  token = res.body.token;

  await request(app)
    .post('/api/transaction')
    .set('x-auth-token', token)
    .send({
      transactionType: 'expense',
      amount: 1500,
      category: 'Shopping',
      accounts: ['bank'],
    });

  await request(app)
    .post('/api/transaction')
    .set('x-auth-token', token)
    .send({
      transactionType: 'income',
      amount: 1500,
      category: 'Income',
      accounts: ['bank'],
    });

  res = await request(app)
    .get('/api/transaction/get-transactions')
    .set('x-auth-token', token);

  transactionID = res.body.transactions[0]._id;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Create transaction route', () => {
  it('should not create transaction without authorization token', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .send(testTransaction);

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not create transaction with invalid authorization token', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('x-auth-token', 'invalid token')
      .send(testTransaction);

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should not create transaction without account field in the transaction', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('x-auth-token', token)
      .send({
        transactionType: 'income',
        amount: 3500,
        category: 'Income',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.isError).toBe(true);
  });

  it('should not create transaction with invalid transaction category', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('x-auth-token', token)
      .send({
        transactionType: 'income',
        amount: 3500,
        category: 'Some randome category',
        accounts: ['bank'],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.isError).toBe(true);
    expect(res.body.error.errors.category.name).toEqual('ValidatorError');
  });

  it('should not create transaction with invalid transaction type', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('x-auth-token', token)
      .send({
        transactionType: 'random transaction type',
        amount: 3500,
        category: 'Income',
        accounts: ['bank'],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.isError).toBe(true);
    expect(res.body.error.errors.transactionType.name).toEqual(
      'ValidatorError'
    );
  });

  it('should create transaction with valid details', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('x-auth-token', token)
      .send(testTransaction);

    expect(res.statusCode).toBe(200);
    expect(res.body.isError).toBe(false);
    expect(res.body.message).toEqual(
      'Successfully created transaction record!'
    );
  });
});

describe('Transaction update route', () => {
  it('should not update transaction without authorization token', async () => {
    const res = await request(app)
      .put(`/api/transaction/${transactionID}`)
      .send({ amount: 5000 });

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not update transaction with invalid token', async () => {
    const res = await request(app)
      .put(`/api/transaction/${transactionID}`)
      .set('x-auth-token', 'invalid token')
      .send({ amount: 5000 });

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should update transaction with valid details', async () => {
    const res = await request(app)
      .put(`/api/transaction/${transactionID}`)
      .set('x-auth-token', token)
      .send({ amount: 5000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.isError).toBe(false);
    expect(res.body.message).toEqual(
      'Successfully updated the transaction record!'
    );
  });
});

describe('Transaction deletion route', () => {
  it('should not delete transaction without authorization token', async () => {
    const res = await request(app).delete(`/api/transaction/${transactionID}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not delete transaction with invalid token', async () => {
    const res = await request(app)
      .delete(`/api/transaction/${transactionID}`)
      .set('x-auth-token', 'invalid token');

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should delete transaction with valid transaction id', async () => {
    const res = await request(app)
      .delete(`/api/transaction/${transactionID}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.isError).toBe(false);
    expect(res.body.message).toEqual(
      'Successfully deleted the transaction record!'
    );
  });
});

describe('Get all transactions of the user route', () => {
  it('should not retreive transaction when auth token is not provided', async () => {
    const res = await request(app).get('/api/transaction/get-transactions');

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not retreive transactions when invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/transaction/get-transactions')
      .set('x-auth-token', 'invalid token');

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should retreive transactions when valid authorization token is provided', async () => {
    const res = await request(app)
      .get('/api/transaction/get-transactions')
      .set('x-auth-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.transactions.length).toEqual(2);

    res.body.transactions.forEach((transaction) => {
      expect(transaction).not.toBe(undefined);
    });
  });
});

describe('Transfer type transaction creation route', () => {
  it('should not create transfer transaction without authorization token', async () => {
    const res = await request(app)
      .post('/api/transaction/transfer')
      .send({
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank', 'gpay'],
        category: 'Others',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not create transfer type transaction with invalid token', async () => {
    const res = await request(app)
      .post('/api/transaction/transfer')
      .set('x-auth-token', 'invalid token')
      .send({
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank', 'gpay'],
        category: 'Others',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should not create transfer type transactions without amount', async () => {
    const res = await request(app)
      .post('/api/transaction/transfer')
      .set('x-auth-token', token)
      .send({
        transactionType: 'transfer',
        accounts: ['bank', 'gpay'],
        category: 'Others',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.isError).toBe(true);
  });

  it('should not create transfer type transactions without transaction type', async () => {
    const res = await request(app)
      .post('/api/transaction/transfer')
      .set('x-auth-token', token)
      .send({
        amount: 500,
        accounts: ['bank', 'gpay'],
        category: 'Others',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.isError).toBe(true);
  });

  it('should not create transfer type transactions without category', async () => {
    const res = await request(app)
      .post('/api/transaction/transfer')
      .set('x-auth-token', token)
      .send({
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank', 'gpay'],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.isError).toBe(true);
  });

  it('should not create transfer type transactions without 2 accounts', async () => {
    const res = await request(app)
      .post('/api/transaction/transfer')
      .set('x-auth-token', token)
      .send({
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank'],
        category: 'Others',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.isError).toBe(true);
  });

  it('should create transfer type transactions with valid details', async () => {
    const res = await request(app)
      .post('/api/transaction/transfer')
      .set('x-auth-token', token)
      .send({
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank', 'gpay'],
        category: 'Others',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.isError).toBe(false);
    expect(res.body.message).toEqual(
      'Successfully created transaction records!'
    );
  });
});

describe('Retreive transactions by date route', () => {
  const year = moment().year();

  it('should not retreive transactions without authorization token', async () => {
    const res = await request(app).get(
      `/api/transaction/get-transactions-by-date?timeSpan=Year&date=${year}`
    );

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not retreive transactions with invalid token', async () => {
    const res = await request(app)
      .get(
        `/api/transaction/get-transactions-by-date?timeSpan=Year&date=${year}`
      )
      .set('x-auth-token', 'invalid token');

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should retreive transactions when provided with valid token', async () => {
    const res = await request(app)
      .get(
        `/api/transaction/get-transactions-by-date?timeSpan=Year&date=${year}`
      )
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.isError).toBe(false);
    expect(res.body.transactions.length).toEqual(4);
  });
});
