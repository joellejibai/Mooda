const express = require('express');
const router = express.Router();
const Item = require('../models/itemModel');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth, async (req, res) => {
    try {
        console.log("✅ Upload endpoint hit");
        console.log("📦 Body received:", req.body);

        const { image, category, color } = req.body;

        if (!image || !category || !color) {
            console.log("⚠️ Missing required fields");
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newItem = new Item({
            image,
            category,
            color,
            user_id: req.user._id,
        });

        await newItem.save();
        console.log("✅ Image item saved:", newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("❌ Upload failed:", error.message);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

module.exports = router;
