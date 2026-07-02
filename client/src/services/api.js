const API_BASE_URL = '/api';

export const getMessages = async (user, withUser) => {
  const params = new URLSearchParams({ user, with: withUser });
  const response = await fetch(`${API_BASE_URL}/messages?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

export const sendMessage = async (message) => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
};

export const getUsers = async (exclude) => {
  const params = exclude ? `?exclude=${encodeURIComponent(exclude)}` : '';
  const response = await fetch(`${API_BASE_URL}/users${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};
