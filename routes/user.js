const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/user/:gmailId', async (req, res) => {
  console.log('user route hit');
  const { gmailId } = req.params;
  try {
    const user = await User.findOne({
      email: gmailId,
    });
    if (user) {
      console.log(user.accounts);
      console.log(user.accounts.length);
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
