const cronJob = require('node-cron');
const User = require('../models/user');
const { updateCurrentMonthBalance } = require('../services/statistics.service');

exports.initScheduledJobs = () => {
  const updateBalanceJob = cronJob.schedule('0 0 1 * *', async () => {
    const users = await User.find({}).select('-password');
    for (let idx = 0; users.length; idx++) {
      const userId = users[idx]._id.toString();
      await updateCurrentMonthBalance(userId);
    }
  });

  updateBalanceJob.start();
};
