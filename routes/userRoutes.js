const express = require('express');
const User = require('../model/User');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await User.create({ username, password });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
