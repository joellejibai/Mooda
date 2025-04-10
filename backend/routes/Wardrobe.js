const express = require('express');
const Wardrobe = require('../models/Wardrobe');
const Item = require('../models/Item'); // Assuming Item model exists
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Route to fetch the wardrobe
router.get('/wardrobe/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).populate('wardrobe');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user.wardrobe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to add item to wardrobe
router.post('/wardrobe/add', async (req, res) => {
    const { userId, itemId, category } = req.body;
    try {
        const wardrobe = await addItemToWardrobe(userId, itemId, category);
        res.status(200).json(wardrobe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
