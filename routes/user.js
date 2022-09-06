const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getUserInfo,
  addAccount,
  deleteAccount,
} = require('../controllers/user.controller');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/info', auth, getUserInfo);

router.put('/add-account', auth, addAccount);

router.put('/delete-account', auth, deleteAccount);

module.exports = router;
