import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed) {
      onLogin(trimmed);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to Chat App</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <button type="submit" className="login-btn">Join Chat</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
