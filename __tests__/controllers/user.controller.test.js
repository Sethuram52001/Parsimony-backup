const { getMockReq } = require('@jest-mock/express');
const { mockResponse } = require('../../utils/interceptor');
const { connectDB, disconnectDB } = require('../db');
const { registerUser } = require('../../controllers/user.controller');

require('dotenv').config();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Register user controller', () => {
  let req;

  it('should return failure message on registration of user when required fields are missing', async () => {
    req = getMockReq({
      body: {
        name: 'test',
        password: 'test',
        accounts: [
          {
            accountName: 'gpay',
            balance: 10000,
          },
        ],
      },
    });

    const res = mockResponse();
    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return success message on registration of user', async () => {
    req = getMockReq({
      body: {
        email: 'test@gmail.com',
        name: 'test',
        password: 'test',
        accounts: [
          {
            accountName: 'gpay',
            balance: 10000,
          },
        ],
      },
    });

    const res = mockResponse();
    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      message: 'User created successfully!',
      token: expect.any(String),
    });
  });

  it('should return failure message on registration of new user with existing email id', async () => {
    req = getMockReq({
      body: {
        email: 'test@gmail.com',
        name: 'test',
        password: 'test',
        accounts: [
          {
            accountName: 'gpay',
            balance: 10000,
          },
        ],
      },
    });

    const res = mockResponse();
    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Already an user exists with this email id',
    });
  });
});
