const Item = require('../models/itemModel');
const mongoose = require('mongoose');

// Tag generator
function generateTags(category, color) {
    const tags = [];


    if (category) tags.push(category.toLowerCase());
    if (color) tags.push(color.toLowerCase());

    switch (category?.toLowerCase()) {
        case "hoodie":
            tags.push("casual", "comfy", "oversized", "cozy", "streetwear");
            break;
        case "heels":
            tags.push("chic", "formal", "elegant", "night-out", "statement");
            break;
        case "jeans":
            tags.push("denim", "dailywear", "casual", "relaxed", "neutral");
            break;
        case "jacket":
            tags.push("layered", "outerwear", "cool-weather", "bold", "winter");
            break;
        case "crop-top":
            tags.push("y2k", "feminine", "trendy", "youthful", "party");
            break;
        case "sneakers":
            tags.push("sporty", "active", "daily", "versatile", "youthful");
            break;
        case "trousers":
            tags.push("classic", "neutral", "business", "clean", "elegant");
            break;
        case "dress":
            tags.push("feminine", "chic", "formal", "effortless", "elevated");
            break;
        case "tank-top":
            tags.push("minimal", "summer", "casual", "lightwear");
            break;
        case "boots":
            tags.push("edgy", "fall", "layered", "powerful", "strong");
            break;
    }

    switch (color?.toLowerCase()) {
        case "black":
            tags.push("minimal", "luxury", "classic", "timeless");
            break;
        case "white":
            tags.push("clean", "fresh", "neutral", "basic");
            break;
        case "beige":
            tags.push("neutral", "earthy", "elegant");
            break;
        case "pink":
            tags.push("feminine", "cute", "romantic");
            break;
        case "blue":
            tags.push("cool", "calm", "casual");
            break;
        case "green":
            tags.push("nature", "fresh", "earthy");
            break;
        case "red":
            tags.push("bold", "statement", "powerful");
            break;
    }

    return [...new Set(tags)];
}

// Get all items for the logged-in user
const getItems = async (req, res) => {
    const user_id = req.user._id;
    const items = await Item.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(items);
};

// Get one item
const getItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid item ID' });
    }

    const item = await Item.findOne({ _id: id, user_id: req.user._id });

    if (!item) {
        return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    res.status(200).json(item);
};

// auto-generate tags
const createItem = async (req, res) => {
    const { category, image, color } = req.body;

    if (!image || !category || !color) {
        return res.status(400).json({ error: "Image, category, and color are required." });
    }

    try {
        const user_id = req.user._id;
        const tags = generateTags(category, color);

        const item = await Item.create({ category, image, color, tags, user_id });
        res.status(200).json(item);
    } catch (error) {
        console.error("Create item error:", error);
        res.status(400).json({ error: error.message });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid item ID' });
    }

    const item = await Item.findOneAndDelete({ _id: id, user_id: req.user._id });

    if (!item) {
        return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    res.status(200).json(item);
};

// Update item
const updateItem = async (req, res) => {
    const { id } = req.params;
    const { category, color } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid item ID' });
    }

    try {
        const existingItem = await Item.findOne({ _id: id, user_id: req.user._id });
        if (!existingItem) {
            return res.status(404).json({ error: 'Item not found or unauthorized' });
        }

        const updatedCategory = category || existingItem.category;
        const updatedColor = color || existingItem.color;

        const newTags = generateTags(updatedCategory, updatedColor);

        const updatedItem = await Item.findOneAndUpdate(
            { _id: id, user_id: req.user._id },
            { ...req.body, tags: newTags },
            { new: true }
        );

        res.status(200).json(updatedItem);
    } catch (err) {
        console.error("Update item error:", err);
        res.status(500).json({ error: "Failed to update item." });
    }
};


module.exports = {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem
};
