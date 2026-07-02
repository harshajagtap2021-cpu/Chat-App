let messages = [];
let messageIdCounter = 1;

const isConversationParticipant = (message, userA, userB) => {
  return (
    (message.sender === userA && message.recipient === userB) ||
    (message.sender === userB && message.recipient === userA)
  );
};

const getMessagesBetweenUsers = (userA, userB) => {
  return messages.filter((msg) => isConversationParticipant(msg, userA, userB));
};

const addMessageToStore = (sender, recipient, text) => {
  const newMessage = {
    id: messageIdCounter++,
    sender,
    recipient,
    text,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  return newMessage;
};

const deleteMessagesForUser = (username) => {
  messages = messages.filter(
    (msg) => msg.sender !== username && msg.recipient !== username
  );
};

module.exports = {
  getMessagesBetweenUsers,
  addMessageToStore,
  deleteMessagesForUser,
};
