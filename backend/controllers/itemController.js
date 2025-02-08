const item = require('../models/itemModel')
const mongoose = require('mongoose')

// Get all items with optional search query
const getItems = async (req, res) => {
    const { search } = req.query; // Get the search query from the URL

    try {
        // If there's a search term, filter the items based on the query.
        const filter = search
            ? {
                $or: [
                    { category: { $regex: search, $options: 'i' } }, // Search in category field
                    { brand: { $regex: search, $options: 'i' } },    // Search in brand field
                    { color: { $regex: search, $options: 'i' } },    // Search in color field
                ],
            }
            : {}; // If there's no search term, fetch all items

        const items = await item.find(filter).sort({ createdAt: -1 });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single item
const getItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such item' })
    }

    try {
        const foundItem = await item.findById(id);

        if (!foundItem) {
            return res.status(404).json({ error: 'No such item' });
        }

        res.status(200).json(foundItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new item
const createItem = async (req, res) => {
    const { category, color, brand, size, material, fit, imageURL } = req.body;

    try {
        const newItem = await item.create({ category, color, brand, size, material, fit, imageURL });
        res.status(200).json(newItem); // Return the newly created item
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an item
const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'No such item to delete' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an item
const updateItem = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedItem = await item.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: 'No such item to update' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem,
};