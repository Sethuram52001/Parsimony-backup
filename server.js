const express = require('express');
const cors = require('cors');
const transaction = require('./routes/transaction');
const user = require('./routes/user');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

require('dotenv').config();
mongoose.connect('mongodb://localhost:27017/Parsimony');

app.use(cors());
app.use(express.json());
app.use('/api', transaction);
app.use('/api', user);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
