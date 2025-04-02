const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');  // Import the ContactMessage model

// Handle POST request to save contact form data
router.post('/', async (req, res) => {
    const { fullname, email, message } = req.body;

    if (!fullname || !email || !message) {
        return res.status(400).json({
            success: false,
            msg: ['All fields are required']
        });
    }

    try {
        const newMessage = new ContactMessage({
            fullname,
            email,
            message
        });

        await newMessage.save();
        console.log('Message saved to database:', newMessage);

        return res.status(200).json({
            success: true,
            msg: ['Message sent successfully']
        });
    } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({
            success: false,
            msg: ['Server error, please try again later']
        });
    }
});

// Route to fetch all contact messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await ContactMessage.find();  // Fetch all messages from MongoDB
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            msg: ['Error fetching messages']
        });
    }
});

module.exports = router;
