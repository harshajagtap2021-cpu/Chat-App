const express = require('express');
const router = express.Router();
const { getConversationMessages, createMessage } = require('../controllers/chatController');

router.get('/messages', getConversationMessages);
router.post('/messages', createMessage);

module.exports = router;
