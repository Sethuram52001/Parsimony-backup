const express = require('express');
const cors = require('cors');
const transaction = require('./routes/transaction');
const user = require('./routes/user');
const db = require('./db');
const app = express();
const port = 5000;

require('dotenv').config();
db.connectToMongoDB();

app.use(cors());
app.use(express.json());
app.use('/api/transaction', transaction);
app.use('/api/user', user);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
