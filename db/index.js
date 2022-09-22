const mongoose = require('mongoose');

const connectToMongoDB = () => {
  mongoose.connect(process.env.MONGO_URI);
};

module.exports = {
  connectToMongoDB,
};
