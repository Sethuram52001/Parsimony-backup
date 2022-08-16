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

module.exports = router;
