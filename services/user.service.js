const User = require('../models/user');
const { hashPassword } = require('../utils/password');

const getUser = async (userId) => {
  return await User.findById(userId).select('-password');
};

const findUser = async (email) => {
  return await User.findOne({ email });
};

const createUser = async ({ name, email, password, accounts }) => {
  const hashedPassword = await hashPassword(password);

  return await User.create({
    name,
    email,
    hashedPassword,
    accounts,
  });
};

const updateUser = async (_id, accounts) => {
  await User.updateOne(
    {
      _id,
    },
    {
      accounts,
    },
    {
      runValidators: true,
    }
  );
};

module.exports = {
  getUser,
  findUser,
  createUser,
  updateUser,
};
