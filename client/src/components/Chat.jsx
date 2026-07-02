import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import { getMessages, sendMessage, getUsers } from '../services/api';
import socket from '../socket';

const isConversationMessage = (message, userA, userB) => {
  return (
    (message.sender === userA && message.recipient === userB) ||
    (message.sender === userB && message.recipient === userA)
  );
};

const Chat = ({ username, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const selectedUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    const joinChat = () => {
      socket.emit('join', { username });
    };

    const handleUserList = (users) => {
      setOnlineUsers(users);
      setOfflineUsers((prev) => prev.filter((u) => !users.includes(u)));
    };

    const handleReceiveMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      if (
        message.recipient === username &&
        message.sender !== selectedUserRef.current
      ) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.sender]: (prev[message.sender] || 0) + 1,
        }));
      }
    };

    const handleUserOffline = ({ username: offlineUser }) => {
      if (offlineUser === username) return;

      setMessages((prev) =>
        prev.filter(
          (msg) => msg.sender !== offlineUser && msg.recipient !== offlineUser
        )
      );

      setOfflineUsers((prev) =>
        prev.includes(offlineUser) ? prev : [...prev, offlineUser]
      );

      setSelectedUser((prev) => (prev === offlineUser ? null : prev));

      setUnreadCounts((prev) => {
        const next = { ...prev };
        delete next[offlineUser];
        return next;
      });
    };

    joinChat();
    socket.on('connect', joinChat);

    socket.on('userList', handleUserList);
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('userOffline', handleUserOffline);

    getUsers(username).then(setOnlineUsers).catch(console.error);

    return () => {
      socket.off('connect', joinChat);
      socket.off('userList', handleUserList);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('userOffline', handleUserOffline);
    };
  }, [username]);

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    if (!onlineUsers.includes(selectedUser)) {
      return;
    }

    const loadConversation = async () => {
      try {
        const data = await getMessages(username, selectedUser);
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadConversation();
  }, [username, selectedUser, onlineUsers]);

  const handleSendMessage = async (text) => {
    if (!selectedUser || !onlineUsers.includes(selectedUser)) return;

    try {
      const newMessage = await sendMessage({
        sender: username,
        recipient: selectedUser,
        text,
      });
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    socket.emit('leave');
    onLogout();
  };

  const handleSelectUser = (user) => {
    if (onlineUsers.includes(user)) {
      setSelectedUser(user);
      setUnreadCounts((prev) => {
        const next = { ...prev };
        delete next[user];
        return next;
      });
    }
  };

  const visibleMessages = selectedUser
    ? messages.filter((msg) => isConversationMessage(msg, username, selectedUser))
    : [];

  const isSelectedUserOnline = selectedUser && onlineUsers.includes(selectedUser);

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>{username}</h3>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        <UserList
          onlineUsers={onlineUsers}
          offlineUsers={offlineUsers}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          currentUsername={username}
          unreadCounts={unreadCounts}
        />
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <h2>
            {selectedUser
              ? isSelectedUserOnline
                ? `Chat with ${selectedUser}`
                : `${selectedUser} is offline`
              : 'Select a user to chat'}
          </h2>
        </div>
        {selectedUser && isSelectedUserOnline ? (
          <>
            <MessageList messages={visibleMessages} currentUsername={username} />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="no-chat-selected">
            {selectedUser && !isSelectedUserOnline ? (
              <>
                <p>{selectedUser} has logged out.</p>
                <p className="privacy-note">Chat history has been cleared.</p>
              </>
            ) : (
              <>
                <p>Choose an online user from the list to start a private conversation.</p>
                <p className="privacy-note">Only you and the selected user can see your messages.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
