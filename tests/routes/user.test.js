const request = require('supertest');
const app = require('../../server');

describe('User endpoint', () => {
  it('should register user', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        email: 'sethu@gmail.com',
        name: 'sethu',
        password: 'sethu',
        accounts: [
          {
            accountName: 'gpay',
            balance: 10000,
          },
        ],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual('User created successfully!');
  });
});
