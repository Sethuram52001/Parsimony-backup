const mongoose = require('mongoose');
const config = require('config');

const connectToMongoDB = () => {
  mongoose.connect(config.get('database'));
};

module.exports = {
  connectToMongoDB,
};
