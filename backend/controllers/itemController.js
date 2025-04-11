const Item = require('../models/itemModel');
const mongoose = require('mongoose');

const getItems = async (req, res) => {
    const user_id = req.user._id;
    const items = await Item.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(items);
};

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

const createItem = async (req, res) => {
    const { category, image, color } = req.body;

    try {
        const user_id = req.user._id;
        const item = await Item.create({ category, image, color, user_id });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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

const updateItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid item ID' });
    }

    const item = await Item.findOneAndUpdate(
        { _id: id, user_id: req.user._id },
        { ...req.body },
        { new: true }
    );

    if (!item) {
        return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    res.status(200).json(item);
};

module.exports = {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem
};
