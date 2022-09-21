const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/password');
const {
  getUser,
  findUser,
  createUser,
  updateUser,
} = require('../services/user.service');

const registerUser = async (req, res) => {
  const user = req.body;
  try {
    const existingUser = await findUser(user.email);
    if (existingUser) {
      return res.status(400).json({
        isError: true,
        message: 'Already an user exists with this email id',
      });
    }

    const newUser = await createUser(user);

    const payload = {
      user: {
        id: newUser._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7 days',
    });

    return res.status(200).json({
      isError: false,
      message: 'User created successfully!',
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUser(email);
    if (!user) {
      return res
        .status(400)
        .json({ isError: true, message: 'Incorrect email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ isError: true, message: 'Incorrect email or password' });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7 days',
    });

    return res
      .status(200)
      .json({ isError: false, message: 'Logged in successfully!', token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    return res.status(200).json({ isError: false, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, error });
  }
};

const addAccount = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    if (user) {
      await updateUser(user._id, [...user.accounts, req.body.account]);
      return res.status(200).json({
        isError: false,
        message: `Added new account: ${req.body.account.accountName} to the existing list`,
      });
    }

    return res
      .status(404)
      .json({ isError: true, message: 'Cannot find the user!' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const accountToBeDeleted = req.body.account.accountName;
    if (accountToBeDeleted && typeof accountToBeDeleted !== 'undefined') {
      const user = await getUser(req.user.id);
      if (user) {
        const updatedAccounts = [...user.accounts].filter(
          (account) => account.accountName !== accountToBeDeleted
        );
        await updateUser(user._id, [...updatedAccounts]);
        return res.status(200).json({
          isError: false,
          message: `Deleted account: ${accountToBeDeleted} from the existing list`,
        });
      }
      return res
        .status(404)
        .json({ isError: true, message: 'Cannot find the user!' });
    }
    return res.status(400).json({ isError: true, message: 'Invalid account!' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  addAccount,
  deleteAccount,
};
