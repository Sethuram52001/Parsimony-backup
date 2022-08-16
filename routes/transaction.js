const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

router.post('/transaction', async (req, res) => {
  const { email, transactionType, amount } = req.body;
  try {
    await Transaction.create({
      email,
      transactionType,
      amount,
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

router.put('/transaction/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const { email, transactionType, amount } = req.body;
  try {
    await Transaction.updateOne(
      {
        _id: transactionId,
      },
      {
        email,
        transactionType,
        amount,
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

router.delete('/transaction/:transactionId', async (req, res) => {
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

module.exports = router;
