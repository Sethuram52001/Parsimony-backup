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
  } catch (error) {
    console.log(error);
    return res.json({ status: 'error', error });
  }
  return res.json({
    status: 'success',
    message: 'Successfully created transaction record!',
  });
});

module.exports = router;
