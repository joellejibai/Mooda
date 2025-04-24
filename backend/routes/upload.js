const express = require('express');
const router = express.Router();
const Item = require('../models/itemModel');
const requireAuth = require('../middleware/requireAuth');

// ✅ Tag generator
const generateTags = ({ category, color }) => {
    const tags = [];

    if (category) tags.push(category.toLowerCase());
    if (color) tags.push(color.toLowerCase());

    const synonyms = {
        tshirt: ['top', 'shirt'],
        hoodie: ['sweater'],
        pants: ['trousers', 'bottom'],
        jeans: ['denim', 'bottom'],
        sneakers: ['shoes', 'footwear'],
        heels: ['shoes', 'footwear'],
        skirt: ['bottom'],
        jacket: ['coat', 'outerwear']
    };

    const extra = synonyms[category?.toLowerCase()];
    if (extra) tags.push(...extra);

    return [...new Set(tags)];
};

router.post('/', requireAuth, async (req, res) => {
    try {
        console.log("✅ Upload endpoint hit");
        console.log("📦 Body received:", req.body);

        const { image, category, color } = req.body;

        if (!image || !category || !color) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // ✅ Generate tags before saving
        const tags = generateTags({ category, color });

        const newItem = new Item({
            image,
            category,
            color,
            user_id: req.user._id,
            tags, // ✅ Save tags
        });

        await newItem.save();
        console.log("✅ Item with tags saved:", newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("❌ Upload failed:", error.message);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

module.exports = router;
