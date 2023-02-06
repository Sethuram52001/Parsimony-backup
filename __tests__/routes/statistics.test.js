const { connectDB, disconnectDB } = require('./../db/index');
const request = require('supertest');
const app = require('../../server');

let token;
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

beforeAll(async () => {
  await connectDB();
  const res = await request(app).post('/api/user/register').send(testUser);

  token = res.body.token;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Statistics - get accounts by balance', () => {
  it('should return accounts sorted by balance', async () => {
    const res = await request(app)
      .get('/api/statistics/balance-by-accounts')
      .set('x-auth-token', token);
    const accounts = res.body.accounts.map((account) => account.balance);
    const expectedRes = testUser.accounts
      .sort((account1, account2) => account2.balance - account1.balance)
      .map((account) => account.balance);
    expect(res.statusCode).toBe(200);

    expect(accounts).toEqual(expectedRes);
  });
});
