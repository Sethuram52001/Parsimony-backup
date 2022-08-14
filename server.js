const express = require('express');
const cors = require('cors');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

require('dotenv').config();
mongoose.connect('mongodb://localhost:27017/Parsimony');

app.use(cors());
app.use(express.json());
app.use('/api', auth);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
