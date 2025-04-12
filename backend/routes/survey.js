const express = require('express');
const router = express.Router();
const UserStyle = require('../models/userStyleModel');

router.post('/', async (req, res) => {
    try {
        const userId = req.user._id; 
        const { style, colorPalette, pattern } = req.body;

        let existing = await UserStyle.findOne({ userId });

        if (existing) {
            existing.style = style;
            existing.colorPalette = colorPalette;
            existing.pattern = pattern;
            await existing.save();
        } else {
            const newStyle = new UserStyle({ userId, style, colorPalette, pattern });
            await newStyle.save();
        }

        res.status(200).json({ message: "Preferences saved successfully." });
    } catch (err) {
        console.error("Survey error:", err);
        res.status(500).json({ error: "Failed to save preferences." });
    }
});

module.exports = router;
