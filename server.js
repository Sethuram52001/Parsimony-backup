const express = require('express');
const cors = require('cors');
const transaction = require('./routes/transaction');
const user = require('./routes/user');
const statistics = require('./routes/statistics');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/transaction', transaction);
app.use('/api/user', user);
app.use('/api/statistics', statistics);

module.exports = app;
