const { getOnlineUsers } = require('../data/users');

const getUsers = (req, res) => {
  try {
    const { exclude } = req.query;
    let users = getOnlineUsers();

    if (exclude) {
      users = users.filter((u) => u !== exclude);
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

module.exports = {
  getUsers,
};
