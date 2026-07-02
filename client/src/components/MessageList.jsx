import React from 'react';
import Message from './Message';

const MessageList = ({ messages, currentUsername }) => {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">No messages yet. Start the conversation!</div>
      ) : (
        messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isOwn={message.sender === currentUsername}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;
