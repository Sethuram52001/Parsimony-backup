const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const { auth } = require('../middleware/auth');
const User = require('../models/user');

router.post('/transaction', auth, async (req, res) => {
  const { transactionType, amount, accounts, category, description } = req.body;
  try {
    const user = await User.findById(req.user.id).select('-password');
    const account = accounts[0];

    const accountToBeUpdated = user.accounts.filter(
      (acc) => acc.accountName === account
    )[0];
    let updatedBalance = accountToBeUpdated.balance;
    updatedBalance += transactionType === 'expense' ? -amount : amount;
    const updatedAccounts = user.accounts;

    for (const acc of updatedAccounts) {
      if (acc.accountName === account) {
        acc.balance = updatedBalance;
        break;
      }
    }

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        accounts: updatedAccounts,
      }
    );

    await Transaction.create({
      email: user.email,
      transactionType,
      account,
      amount,
      category,
      description,
    });

    return res.status(200).json({
      isError: false,
      message: 'Successfully created transaction record!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
});

router.put('/transaction/:transactionId', auth, async (req, res) => {
  const { transactionId } = req.params;
  const { transactionType, account, amount, category, description } = req.body;
  try {
    await Transaction.updateOne(
      {
        _id: transactionId,
      },
      {
        transactionType,
        account,
        amount,
        category,
        description,
      },
      {
        runValidators: true,
      }
    );
    return res.status(200).json({
      isError: false,
      message: 'Successfully updated the transaction record!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
});

router.delete('/transaction/:transactionId', auth, async (req, res) => {
  const { transactionId } = req.params;
  try {
    await Transaction.deleteOne({
      _id: transactionId,
    });
    return res.status(200).json({
      isError: false,
      message: 'Successfully deleted the transaction record!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
});

router.post('/transaction/transfer', auth, async (req, res) => {
  const { transactionType, amount, accounts, category, description } = req.body;
  try {
    const user = await User.findById(req.user.id).select('-password');
    const accountCredited = accounts[0];
    const accountDebited = accounts[1];

    let accountToBeUpdated = user.accounts.filter(
      (acc) => acc.accountName === accountCredited
    )[0];
    let updatedBalance = accountToBeUpdated.balance - amount;
    let updatedAccounts = user.accounts;

    for (const acc of updatedAccounts) {
      if (acc.accountName === accountCredited) {
        acc.balance = updatedBalance;
        break;
      }
    }

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        accounts: updatedAccounts,
      }
    );

    await Transaction.create({
      email: user.email,
      transactionType,
      account: accountCredited,
      amount,
      category,
      description,
    });

    accountToBeUpdated = user.accounts.filter(
      (acc) => acc.accountName === accountDebited
    )[0];
    updatedBalance = accountToBeUpdated.balance;
    updatedBalance += transactionType === 'expense' ? -amount : amount;
    updatedAccounts = user.accounts;

    for (const acc of updatedAccounts) {
      if (acc.accountName === accountDebited) {
        acc.balance = updatedBalance;
        break;
      }
    }

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        accounts: updatedAccounts,
      }
    );

    await Transaction.create({
      email: user.email,
      transactionType,
      account: accountDebited,
      amount,
      category,
      description,
    });

    return res.status(200).json({
      isError: false,
      message: 'Successfully created transaction records!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
});

router.get('/transaction/get-transactions', auth, async (req, res) => {
  const { email } = await User.findById(req.user.id).select('email');
  try {
    const transactions = await Transaction.find({ email })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json({ isError: false, transactions });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
});

module.exports = router;
