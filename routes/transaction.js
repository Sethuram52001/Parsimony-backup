const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  transferTypeTransaction,
  getTransactions,
  getTransactionsByDate,
} = require('../controllers/transactions.controller');

router.post('/', auth, createTransaction);

router.put('/:transactionId', auth, updateTransaction);

router.delete('/:transactionId', auth, deleteTransaction);

router.post('/transfer', auth, transferTypeTransaction);

router.get('/get-transactions', auth, getTransactions);

router.get('/get-transactions-by-date', auth, getTransactionsByDate);

module.exports = router;
