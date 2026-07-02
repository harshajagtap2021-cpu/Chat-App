const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Chat API Server is running' });
});

module.exports = app;
