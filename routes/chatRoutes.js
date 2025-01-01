const express = require('express');
const Message = require('../model/message');
const router = express.Router();

// Get chat history
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find({ room: 'chatroom' }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
