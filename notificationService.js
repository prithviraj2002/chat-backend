const admin = require('./firebase');

const sendNotification = async (message) => {
    const payload = {
        notification: {
            title: message.sender,
            body: message.content,
        },
        topic: 'chatroom',
    };
    try {
        // Send notification to a specific topic
        await admin.messaging().send(message = payload);
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = sendNotification;
