const { getUser, getUserAccounts } = require('../services/user.service');

const balanceByAccounts = async (req, res) => {
  try {
    const userId = await getUser(req.user.id);
    const { accounts } = await getUserAccounts(userId);
    accounts.sort((account1, account2) => account2.balance - account1.balance);
    return res.status(200).json({ isError: true, accounts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ isError: true, error });
  }
};

module.exports = {
  balanceByAccounts,
};
