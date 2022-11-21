const { getMockReq } = require('@jest-mock/express');
const { mockResponse } = require('../../utils/interceptor');
const { connectDB, disconnectDB } = require('../db');
const {
  registerUser,
  loginUser,
  getUserInfo,
  addAccount,
  deleteAccount,
} = require('../../controllers/user.controller');
const { findUser } = require('../../services/user.service');

require('dotenv').config();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

let userID;

describe('Register user controller', () => {
  let req;

  afterAll(async () => {
    const res = await findUser('test@gmail.com');
    userID = res._id;
  });

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

describe('Login user controller', () => {
  let req;

  it('should return failure message when provided with invalid email', async () => {
    req = getMockReq({
      body: {
        email: 'dummy@gmail.com',
        password: 'dummy',
      },
    });

    const res = mockResponse();
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Incorrect email or password',
    });
  });

  it('should return failure message when provided with invalid password', async () => {
    req = getMockReq({
      body: {
        email: 'test@gmail.com',
        password: 'wrong password',
      },
    });

    const res = mockResponse();
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Incorrect email or password',
    });
  });

  it('should return success message when provided with valid email and password', async () => {
    req = getMockReq({
      body: {
        email: 'test@gmail.com',
        password: 'test',
      },
    });

    const res = mockResponse();
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      message: 'Logged in successfully!',
      token: expect.any(String),
    });
  });
});

describe('Get user info controller', () => {
  it('should return failure message when not provided with user id', async () => {
    const req = getMockReq();

    const res = mockResponse();
    await getUserInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.any(Object),
    });
  });

  it('should return user info when provided valid user id', async () => {
    const req = getMockReq({
      user: {
        id: userID,
      },
    });
    const res = mockResponse();
    await getUserInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      user: expect.any(Object),
    });
  });
});

describe('Add account controller', () => {
  it('should return failure message if user not found', async () => {
    const req = getMockReq({
      user: {
        id: '000000000000000000000000',
      },
    });

    const res = mockResponse();
    await addAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Cannot find the user!',
    });
  });

  it('should return success message on adding account to the user', async () => {
    const req = getMockReq({
      user: {
        id: userID,
      },
      body: {
        account: {
          accountName: 'bank',
          balance: 2000,
        },
      },
    });

    const res = mockResponse();
    await addAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      message: 'Added new account: bank to the existing list',
    });
  });

  it('should return failure message on trying to add duplicate account', async () => {
    const req = getMockReq({
      user: {
        id: userID,
      },
      body: {
        account: {
          accountName: 'bank',
          balance: 2000,
        },
      },
    });

    const res = mockResponse();
    await addAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.any(Object),
    });
  });
});

describe('Delete account controller', () => {
  it('should return failure message if user not found', async () => {
    const req = getMockReq({
      user: {
        id: '000000000000000000000000',
      },
      body: {
        account: {
          accountName: 'bank',
        },
      },
    });

    const res = mockResponse();
    await deleteAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Cannot find the user!',
    });
  });

  it('should return failure message if account is not provided', async () => {
    const req = getMockReq({
      user: {
        id: userID,
      },
    });

    const res = mockResponse();
    await deleteAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      error: expect.anything(),
    });
  });

  it('should return failure message if invalid account is provided', async () => {
    const req = getMockReq({
      user: {
        id: userID,
      },
      body: {
        account: {},
      },
    });

    const res = mockResponse();
    await deleteAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Invalid account!',
    });
  });

  it('should return success message if provided correct details', async () => {
    const req = getMockReq({
      user: {
        id: userID,
      },
      body: {
        account: {
          accountName: 'bank',
        },
      },
    });

    const res = mockResponse();
    await deleteAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isError: false,
      message: 'Deleted account: bank from the existing list',
    });
  });
});
