const { getMessagesBetweenUsers, addMessageToStore } = require('../data/messages');
const { getSocketId } = require('../data/users');

const getConversationMessages = (req, res) => {
  try {
    const { user, with: otherUser } = req.query;

    if (!user || !otherUser) {
      return res.status(400).json({
        error: 'Both user and with query parameters are required',
      });
    }

    const messages = getMessagesBetweenUsers(user, otherUser);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

const createMessage = (req, res) => {
  try {
    const { sender, recipient, text } = req.body;

    if (!sender || !recipient || !text) {
      return res.status(400).json({
        error: 'Sender, recipient, and text are required',
      });
    }

    const newMessage = addMessageToStore(sender, recipient, text);

    const io = req.app.get('io');
    const recipientSocketId = getSocketId(recipient);
    const senderSocketId = getSocketId(sender);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receiveMessage', newMessage);
    }
    if (senderSocketId && senderSocketId !== recipientSocketId) {
      io.to(senderSocketId).emit('receiveMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create message',
    });
  }
};

module.exports = {
  getConversationMessages,
  createMessage,
};
