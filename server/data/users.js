const onlineUsers = new Map();

const addUser = (username, socketId) => {
  onlineUsers.set(username, socketId);
};

const removeUser = (username) => {
  onlineUsers.delete(username);
};

const removeUserBySocketId = (socketId) => {
  for (const [username, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(username);
      return username;
    }
  }
  return null;
};

const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

const getSocketId = (username) => {
  return onlineUsers.get(username);
};

module.exports = {
  addUser,
  removeUser,
  removeUserBySocketId,
  getOnlineUsers,
  getSocketId,
};
