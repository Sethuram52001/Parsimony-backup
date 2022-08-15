const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword } = require('../utils/password');
const User = require('../models/user');

router.post('/login', async (req, res) => {
  const { email, password } = JSON.parse(req.body.loginData);
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid login' });
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (isPasswordValid) {
    console.log('valid password');
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
    return res.json({ status: 'success', user: token });
  }
  console.log('invalid password');
  return res.json({ status: 'error' });
});

router.post('/register', async (req, res) => {
  const user = req.body;
  try {
    const hashedPassword = await hashPassword(user.password);
    await User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      accounts: user.accounts,
    });
    return res.json({
      status: 'success',
      message: 'User created successfully!',
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 'error', error });
  }
});

module.exports = router;
