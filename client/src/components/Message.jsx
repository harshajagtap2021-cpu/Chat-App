import React from 'react';

const Message = ({ message, isOwn }) => {
  return (
    <div className={`message ${isOwn ? 'own-message' : 'other-message'}`}>
      <div className="message-header">
        <span className="message-username">{message.sender}</span>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}
        </span>
      </div>
      <div className="message-content">{message.text}</div>
    </div>
  );
};

export default Message;
