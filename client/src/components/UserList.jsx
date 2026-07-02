import React from 'react';

const UserList = ({
  onlineUsers,
  offlineUsers,
  selectedUser,
  onSelectUser,
  currentUsername,
  unreadCounts = {},
}) => {
  const otherOnline = onlineUsers.filter((u) => u !== currentUsername);
  const otherOffline = offlineUsers.filter(
    (u) => u !== currentUsername && !onlineUsers.includes(u)
  );

  return (
    <div className="user-list">
      <h3>Online Users</h3>
      {otherOnline.length === 0 ? (
        <p className="no-users">No other users online</p>
      ) : (
        <ul>
          {otherOnline.map((user) => {
            const unread = unreadCounts[user] || 0;

            return (
              <li key={user}>
                <button
                  type="button"
                  className={`user-item ${selectedUser === user ? 'selected' : ''}`}
                  onClick={() => onSelectUser(user)}
                >
                  <span className="status-dot online" />
                  <span className="user-name">{user}</span>
                  {unread > 0 && (
                    <span className="unread-badge">{unread}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {otherOffline.length > 0 && (
        <>
          <h3 className="offline-heading">Offline</h3>
          <ul>
            {otherOffline.map((user) => (
              <li key={user}>
                <div className="user-item offline">
                  <span className="status-dot offline" />
                  <span className="user-name">{user}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default UserList;
