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
      return res.status(200).json({ isError: false, user });
    }

    return res
      .status(404)
      .json({ isError: true, message: 'Cannot find the user!' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
});

router.put('/user/:gmailId/add-account', async (req, res) => {
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

router.put('/user/:gmailId/delete-account', async (req, res) => {
  const { gmailId } = req.params;
  try {
    const accountToBeDeleted = req.body.account.accountName;
    if (accountToBeDeleted && typeof accountToBeDeleted !== 'undefined') {
      const user = await User.findOne({
        email: gmailId,
      });
      if (user) {
        const updatedAccounts = [...user.accounts].filter(
          (account) => account.accountName !== accountToBeDeleted
        );
        await User.updateOne(
          {
            email: gmailId,
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
