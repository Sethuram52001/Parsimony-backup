const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/password');
const { auth } = require('../middleware/auth');

router.post('/user/register', async (req, res) => {
  const user = req.body;
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({
        isError: true,
        message: 'Already an user exists with this email id',
      });
    }
    const hashedPassword = await hashPassword(user.password);
    const newUser = await User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      accounts: user.accounts,
    });

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
});

router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
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
});

router.get('/user/info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.status(200).json({ isError: false, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, error });
  }
});

router.put('/user/add-account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      await User.updateOne(
        {
          _id: user._id,
        },
        {
          accounts: [...user.accounts, req.body.account],
        },
        {
          runValidators: true,
        }
      );
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
});

router.put('/user/delete-account', auth, async (req, res) => {
  try {
    const accountToBeDeleted = req.body.account.accountName;
    if (accountToBeDeleted && typeof accountToBeDeleted !== 'undefined') {
      const user = await User.findById(req.user.id).select('-password');
      if (user) {
        const updatedAccounts = [...user.accounts].filter(
          (account) => account.accountName !== accountToBeDeleted
        );
        await User.updateOne(
          {
            _id: user._id,
          },
          {
            accounts: [...updatedAccounts],
          },
          {
            runValidators: true,
          }
        );
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
});

module.exports = router;
