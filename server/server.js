require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const { addUser, removeUser, removeUserBySocketId, getOnlineUsers } = require('./data/users');
const { deleteMessagesForUser } = require('./data/messages');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

const broadcastUserList = () => {
  io.emit('userList', getOnlineUsers());
};

const handleUserLeave = (username) => {
  if (!username) return;

  deleteMessagesForUser(username);
  removeUser(username);
  broadcastUserList();
  io.emit('userOffline', { username });
  console.log(`${username} went offline — chat history cleared`);
};

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('join', ({ username }) => {
    if (!username) return;

    socket.username = username;
    addUser(username, socket.id);
    const users = getOnlineUsers();
    socket.emit('userList', users);
    broadcastUserList();
    console.log(`${username} joined`);
  });

  socket.on('leave', () => {
    if (socket.username) {
      const username = socket.username;
      socket.username = null;
      handleUserLeave(username);
    }
  });

  socket.on('disconnect', () => {
    const username = removeUserBySocketId(socket.id);
    if (username) {
      deleteMessagesForUser(username);
      broadcastUserList();
      io.emit('userOffline', { username });
      console.log(`${username} disconnected — chat history cleared`);
    }
    socket.username = null;
    console.log('User Disconnected:', socket.id);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other server first:`);
    console.error(`  taskkill /F /PID <pid>   (find pid with: netstat -ano | findstr :${PORT})`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
