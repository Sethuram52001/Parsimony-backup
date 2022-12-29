const express = require('express');
const { balanceByAccounts } = require('../controllers/statistics.controller');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.get('/balance-by-accounts', auth, balanceByAccounts);

module.exports = router;
