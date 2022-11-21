const express = require('express');
const cors = require('cors');
const transaction = require('./routes/transaction');
const user = require('./routes/user');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/transaction', transaction);
app.use('/api/user', user);

module.exports = app;
