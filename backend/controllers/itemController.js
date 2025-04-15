const Item = require('../models/itemModel');
const mongoose = require('mongoose');

// Tag generator
function generateTags(category, color) {
  const tags = [];

  if (category) tags.push(category.toLowerCase());
  if (color) tags.push(color.toLowerCase());

  switch (category?.toLowerCase()) {
    case "hoodie": tags.push("casual", "comfy", "oversized", "cozy", "streetwear"); break;
    case "heels": tags.push("chic", "formal", "elegant", "night-out", "statement"); break;
    case "jeans": tags.push("denim", "dailywear", "casual", "relaxed", "neutral"); break;
    case "jacket": tags.push("layered", "outerwear", "cool-weather", "bold", "winter"); break;
    case "crop-top": tags.push("y2k", "feminine", "trendy", "youthful", "party"); break;
    case "sneakers": tags.push("sporty", "active", "daily", "versatile", "youthful"); break;
    case "trousers": tags.push("classic", "neutral", "business", "clean", "elegant"); break;
    case "dress": tags.push("feminine", "chic", "formal", "effortless", "elevated"); break;
    case "tank-top": tags.push("minimal", "summer", "casual", "lightwear"); break;
    case "boots": tags.push("edgy", "fall", "layered", "powerful", "strong"); break;
  }

  switch (color?.toLowerCase()) {
    case "black": tags.push("minimal", "luxury", "classic", "timeless"); break;
    case "white": tags.push("clean", "fresh", "neutral", "basic"); break;
    case "beige": tags.push("neutral", "earthy", "elegant"); break;
    case "pink": tags.push("feminine", "cute", "romantic"); break;
    case "blue": tags.push("cool", "calm", "casual"); break;
    case "green": tags.push("nature", "fresh", "earthy"); break;
    case "red": tags.push("bold", "statement", "powerful"); break;
  }

  return [...new Set(tags)];
}

// Cache per user signed in 
let cachedItemsByUser = {};
const CACHE_TTL = 60 * 1000; // 1 minute

// GET all items for logged-in user (with cache)
const getItems = async (req, res) => {
  try {
    const user_id = req.user._id;
    const now = Date.now();

    if (
      cachedItemsByUser[user_id] &&
      now - cachedItemsByUser[user_id].timestamp < CACHE_TTL
    ) {
      console.log("Serving items from cache for user:", user_id);
      return res.status(200).json(cachedItemsByUser[user_id].items);
    }

    const items = await Item.find({ user_id });

    cachedItemsByUser[user_id] = {
      items,
      timestamp: now,
    };

    console.log("Fetched items from DB for user:", user_id);
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// GET single item
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

// CREATE item (invalidate user cache)
const createItem = async (req, res) => {
  const { category, image, color } = req.body;

  if (!image || !category || !color) {
    return res.status(400).json({ error: "Image, category, and color are required." });
  }

  try {
    const user_id = req.user._id;
    const tags = generateTags(category, color);

    const item = await Item.create({ category, image, color, tags, user_id });

    delete cachedItemsByUser[user_id]; // Invalidate cache

    res.status(200).json(item);
  } catch (error) {
    console.error("Create item error:", error);
    res.status(400).json({ error: error.message });
  }
};

// DELETE item (invalidate user cache)
const deleteItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid item ID' });
  }

  const item = await Item.findOneAndDelete({ _id: id, user_id: req.user._id });

  if (!item) {
    return res.status(404).json({ error: 'Item not found or unauthorized' });
  }

  delete cachedItemsByUser[req.user._id]; // Invalidate cache

  res.status(200).json(item);
};

// UPDATE item (invalidate user cache)
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

    delete cachedItemsByUser[req.user._id]; // Invalidate cache

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
