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
    return res
      .status(404)
      .json({ isError: true, message: 'Cannot find the user!' });
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ isError: false, user: token });
  }
  return res
    .status(401)
    .json({ isError: true, message: 'Invalid login credentials!' });
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
    return res.status(200).json({
      isError: false,
      message: 'User created successfully!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
});

module.exports = router;
