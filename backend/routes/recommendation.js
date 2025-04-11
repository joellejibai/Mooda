const express = require("express");
const router = express.Router();
const Item = require("../models/itemModel");

router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const items = await Item.find({ user_id: userId });

        // Categorize the items
        const tops = items.filter(item => item.category === "top");
        const bottoms = items.filter(item => item.category === "bottom");
        const foots = items.filter(item => item.category === "foot");

        if (!tops.length || !bottoms.length || !foots.length) {
            return res.status(400).json({ message: "User wardrobe missing top/bottom/foot." });
        }

        // Simple logic: match by most common color
        const mostCommonColor = getMostCommonColor(items);

        const top = tops.find(item => item.color === mostCommonColor) || tops[0];
        const bottom = bottoms.find(item => item.color === mostCommonColor) || bottoms[0];
        const foot = foots.find(item => item.color === mostCommonColor) || foots[0];

        res.json({ top, bottom, foot });
    } catch (err) {
        console.error("Recommendation error:", err);
        res.status(500).json({ message: "Failed to generate recommendation." });
    }
});

// Helper to find the most common color
function getMostCommonColor(items) {
    const count = {};
    items.forEach(item => {
        count[item.color] = (count[item.color] || 0) + 1;
    });
    return Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b);
}

module.exports = router;
