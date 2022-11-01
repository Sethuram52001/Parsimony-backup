const { connectDB, disconnectDB } = require('./../db/index');
const {
  createUser,
  getUser,
  findUser,
  updateUser,
} = require('../../services/user.service');
const mongoose = require('mongoose');

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

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('create user service', () => {
  it('should not create user without name', async () => {
    let err;
    try {
      await createUser({
        email: 'test@gmail.com',
        password: 'test',
        accounts: [
          {
            accountName: 'gpay',
            balance: 10000,
          },
        ],
      });
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it('should not create user without email', async () => {
    let err;
    try {
      await createUser({
        name: 'test',
        password: 'test',
        accounts: [
          {
            accountName: 'gpay',
            balance: 10000,
          },
        ],
      });
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it('should not create user without password', async () => {
    let err;
    try {
      await createUser({
        email: 'test@gmail.com',
        name: 'test',
        accounts: [
          {
            accountName: 'gpay',
            balance: 10000,
          },
        ],
      });
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
  });

  it('should create user when provied with proper details', async () => {
    const res = await createUser({
      email: 'test@gmail.com',
      name: 'test',
      password: 'test',
      accounts: [
        {
          accountName: 'gpay',
          balance: 10000,
        },
      ],
    });

    expect(res._id).toBeDefined();
    expect(res.email).toEqual(testUser.email);
    expect(res.name).toEqual(testUser.name);
    const accounts = res.accounts;

    expect(accounts.length).toEqual(testUser.accounts.length);
    for (let idx = 0; idx < accounts.length; idx++) {
      const account1 = accounts[idx];
      const account2 = testUser.accounts[idx];
      expect(account1.accountName).toEqual(account2.accountName);
      expect(account1.balance).toEqual(account2.balance);
    }
  });
});

describe('User service - get user', () => {
  it('should get the user details when email id exists', async () => {
    const res = await findUser('test@gmail.com');
    expect(res._id).toBeDefined();
    userID = res._id;
  });

  it('should not get the user details when email id doesnt exist', async () => {
    const res = await findUser('test1@gmail.com');
    expect(res).toBe(null);
  });
});

describe('User service - get user', () => {
  it('should get the user details but without the password', async () => {
    const res = await getUser(userID);
    expect(res._id).toEqual(userID);
    expect(res.password).toBeUndefined();
  });

  it('should not get the user details if the user id doesnt exist', async () => {
    const fakeID = '000000000000000000000000';
    const res = await getUser(fakeID);
    expect(res).toBe(null);
  });
});

describe('User service - update user', () => {
  it('should update user when accounts and user id is provided', async () => {
    const accounts = [
      {
        accountName: 'gpay',
        balance: 10000,
      },
      {
        accountName: 'bank',
        balance: 5000,
      },
    ];
    await updateUser(userID, accounts);
    const res = await getUser(userID);
    const updatedAccounts = res.accounts;
    expect(updatedAccounts.length).toEqual(accounts.length);
    for (let idx = 0; idx < updatedAccounts.length; idx++) {
      const account1 = updatedAccounts[idx];
      const account2 = accounts[idx];
      expect(account1.accountName).toEqual(account2.accountName);
      expect(account1.balance).toEqual(account2.balance);
    }
  });
});
