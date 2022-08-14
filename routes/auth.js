const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword } = require('../utils/password');
const User = require('../models/user');

router.post('/login', async (req, res) => {
  console.log('login route');
  const { email, password } = JSON.parse(req.body.loginData);
  console.log(email);
  const user = await User.findOne({
    email,
  });
  console.log(user);

  if (!user) {
    return { status: 'error', error: 'Invalid login' };
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
  const user = JSON.parse(req.body.registrationData);
  try {
    const hashedPassword = await hashPassword(user.password);
    await User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });
    return res.json({ status: 'success' });
  } catch (error) {
    console.log(error);
    return res.json({ status: 'error', error: 'Email already exists' });
  }
});

module.exports = router;
