const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const sendNotification = require('./notificationService');
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Chat Backend is running!');
});

// WebSocket Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Automatically join the single chatroom
    const room = 'chatroom';
    socket.join(room);
    console.log(`User ${socket.id} joined the room: ${room}`);

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
        const { sender, content } = data;

        // Create the message object
        const message = {
            sender,
            content,
            timestamp: new Date(),
        };

        // Broadcast the message to all users in the room
        io.to(room).emit('receiveMessage', message);
        
        await sendNotification(message);

        // Save the message to the database
        saveMessageToDB(message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Function to save message to MongoDB
const saveMessageToDB = async (message) => {
    try {
        const Message = require('./model/message');
        await Message.create({ room: 'chatroom', ...message });
        console.log('Message saved to DB');
    } catch (error) {
        console.error('Error saving message to DB:', error.message);
    }
};


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const connectDB = require('./config/db');
connectDB();

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);
