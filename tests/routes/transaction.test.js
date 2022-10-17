const app = require('../../server');
const request = require('supertest');
const moment = require('moment');

const testTransaction = {
  transactionType: 'income',
  amount: 3500,
  category: 'Income',
  accounts: ['bank'],
};

const testUser = {
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
};
let token, transactionId;

beforeAll(async () => {
  await request(app).post('/api/user/register').send(testUser);
  let res = await request(app).post('/api/user/login').send({
    email: testUser.email,
    password: testUser.password,
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
  transactionId = res.body.transactions[0]._id;
});

describe('Create transaction', () => {
  it('should not create transaction without authorization token', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .send(testTransaction);

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not create transaction with invalid authorization token', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('x-auth-token', 'invalid token')
      .send(testTransaction);

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should not create transaction with missing account field in the transaction record', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('x-auth-token', token)
      .send({
        transactionType: 'income',
        amount: 3500,
        category: 'Income',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
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

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
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

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
    expect(res.body.error.errors.transactionType.name).toEqual(
      'ValidatorError'
    );
  });

  it('should create transaction with valid details', async () => {
    const res = await request(app)
      .post('/api/transaction')
      .set('x-auth-token', token)
      .send(testTransaction);

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual(
      'Successfully created transaction record!'
    );
  });
});

describe('Transaction updation', () => {
  it('should not update transaction without authorization token', async () => {
    const res = await request(app)
      .put(`/api/transaction/${transactionId}`)
      .send({ amount: 5000 });

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not update transaction with invalid token', async () => {
    const res = await request(app)
      .put(`/api/transaction/${transactionId}`)
      .set('x-auth-token', 'invalid token')
      .send({ amount: 5000 });

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should update transaction with valid details', async () => {
    const res = await request(app)
      .put(`/api/transaction/${transactionId}`)
      .set('x-auth-token', token)
      .send({ amount: 5000 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual(
      'Successfully updated the transaction record!'
    );
  });
});

describe('Transaction deletion', () => {
  it('should not delete transaction without authorization token', async () => {
    const res = await request(app).delete(`/api/transaction/${transactionId}`);

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not delete transaction with invalid token', async () => {
    const res = await request(app)
      .delete(`/api/transaction/${transactionId}`)
      .set('x-auth-token', 'invalid token');

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should delete transaction with valid transaction id', async () => {
    const res = await request(app)
      .delete(`/api/transaction/${transactionId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual(
      'Successfully deleted the transaction record!'
    );
  });
});

describe('Get all transactions of th user', () => {
  it('should not retreive transaction when token is not provided', async () => {
    const res = await request(app).get('/api/transaction/get-transactions');

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not retreive transactions when invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/transaction/get-transactions')
      .set('x-auth-token', 'invalid token');

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
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

describe('Transfer type transaction creation', () => {
  it('should not create transfer transaction without authorization token', async () => {
    const res = await request(app)
      .post('/api/transaction/transfer')
      .send({
        transactionType: 'transfer',
        amount: 500,
        accounts: ['bank', 'gpay'],
        category: 'Others',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
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

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
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

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
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

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
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

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
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

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
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

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual(
      'Successfully created transaction records!'
    );
  });
});

describe('Retreive transactions by date', () => {
  const year = moment().year();

  it('should not retreive transactions without authorization token', async () => {
    const res = await request(app).get(
      `/api/transaction/get-transactions-by-date?timeSpan=Year&date=${year}`
    );

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not retreive transactions with invalid token', async () => {
    const res = await request(app)
      .get(
        `/api/transaction/get-transactions-by-date?timeSpan=Year&date=${year}`
      )
      .set('x-auth-token', 'invalid token');

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should retreive transactions when provided with valid token', async () => {
    const res = await request(app)
      .get(
        `/api/transaction/get-transactions-by-date?timeSpan=Year&date=${year}`
      )
      .set('x-auth-token', token);

    console.log(res.body.transactions);

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.transactions.length).toEqual(4);
  });
});
