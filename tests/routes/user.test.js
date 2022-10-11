const request = require('supertest');
const app = require('../../server');

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
let token;

describe('User registration', () => {
  it('should register user with email, name, password and accounts', async () => {
    const res = await request(app).post('/api/user/register').send(testUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual('User created successfully!');
  });

  it('should not register a new user with pre-existing email', async () => {
    const res = await request(app).post('/api/user/register').send(testUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual(
      'Already an user exists with this email id'
    );
  });
});

describe('User login', () => {
  it('should login user with valid email and password', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    token = res.body.token;

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual('Logged in successfully!');
  });

  it('should fail to login user with invalid email or password', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: testUser.email,
      password: 'wrong password',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Incorrect email or password');
  });

  it('should fail to login user with invalid email or password', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: 'test1@gmail.com',
      password: 'wrong password',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Incorrect email or password');
  });
});

describe('User information', () => {
  it('should not return user info when x-auth-token not provided', async () => {
    const res = await request(app).get('/api/user/info');

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not return user info when invalid x-auth-token is provided', async () => {
    const res = await request(app)
      .get('/api/user/info')
      .set('x-auth-token', 'invalid token');

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should return user info when valid x-auth-token is provided', async () => {
    const res = await request(app)
      .get('/api/user/info')
      .set('x-auth-token', token);
    const { user } = res.body;
    const accounts = user.accounts;
    for (const account of accounts) {
      delete account._id;
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(user.email).toEqual(testUser.email);
    expect(user.name).toEqual(testUser.name);
    expect(accounts).toEqual(testUser.accounts);
  });
});

describe('User add account to accounts list', () => {
  it('should not add new account to the accounts list if token is not provided', async () => {
    const res = await request(app)
      .put('/api/user/add-account')
      .send({
        account: {
          accountName: 'testAccount',
          balance: 2000,
        },
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not add new account to the accounts list if invalid token is provided', async () => {
    const res = await request(app)
      .put('/api/user/add-account')
      .set('x-auth-token', 'invalid token')
      .send({
        account: {
          accountName: 'testAccount',
          balance: 2000,
        },
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should not add account which is already present in the accounts list', async () => {
    const res = await request(app)
      .put('/api/user/add-account')
      .set('x-auth-token', token)
      .send({
        account: {
          accountName: 'gpay',
          balance: 2000,
        },
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.isError).toEqual(true);
    expect(res.body.error.errors.accounts.name).toEqual('ValidatorError');
  });

  it('should add new account to the accounts list', async () => {
    const res = await request(app)
      .put('/api/user/add-account')
      .set('x-auth-token', token)
      .send({
        account: {
          accountName: 'testAccount',
          balance: 2000,
        },
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual(
      'Added new account: testAccount to the existing list'
    );
  });
});

describe('User delete account from accounts list', () => {
  it('should not delete account from the accounts list if token is not provided', async () => {
    const res = await request(app)
      .put('/api/user/delete-account')
      .send({
        account: {
          accountName: 'testAccount',
        },
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('No token, authorization denied');
  });

  it('should not delete account from the accounts list if invalid token is provided', async () => {
    const res = await request(app)
      .put('/api/user/delete-account')
      .set('x-auth-token', 'invalid token')
      .send({
        account: {
          accountName: 'testAccount',
        },
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.isError).toEqual(true);
    expect(res.body.message).toEqual('Invalid token');
  });

  it('should delete account from the accounts list if valid token is provided', async () => {
    const res = await request(app)
      .put('/api/user/delete-account')
      .set('x-auth-token', token)
      .send({
        account: {
          accountName: 'testAccount',
        },
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.isError).toEqual(false);
    expect(res.body.message).toEqual(
      'Deleted account: testAccount from the existing list'
    );
  });
});
