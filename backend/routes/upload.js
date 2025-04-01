const express = require('express');
const router = express.Router();
const Item = require('../models/itemModel'); // Make sure you have this
const requireAuth = require('../middleware/requireAuth'); // Same as your items routes

// Protect the route (user must be logged in)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { image } = req.body;

        const newItem = new Item({
            image, // We will store base64 here for now
            category: "unknown", // you can change later
            user_id: req.user._id, // Link to the user
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

module.exports = router;
