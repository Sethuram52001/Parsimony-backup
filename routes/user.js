const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/user/:gmailId', async (req, res) => {
  const { gmailId } = req.params;
  try {
    const user = await User.findOne({
      email: gmailId,
    });
    if (user) {
      return res.json({ status: 'success', user });
    } else {
      return res.json({ status: 'error', message: 'cannot find user' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 'error', error });
  }
});

router.put('/user/:gmailId', async (req, res) => {
  const { gmailId } = req.params;
  try {
    const user = await User.findOne({
      email: gmailId,
    });
    if (user) {
      await User.updateOne(
        {
          email: gmailId,
        },
        {
          accounts: [...user.accounts, req.body.account],
        },
        {
          runValidators: true,
        }
      );
      return res.json({ status: 'success', user });
    } else {
      return res.json({ status: 'error', message: 'cannot find user' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 'error', error });
  }
});

module.exports = router;
