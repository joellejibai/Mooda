const express = require('express');
const router = express.Router();
const Trend = require('../models/Trend'); // Your model

// POST: add new trend outfit
router.post('/', async (req, res) => {
    try {
        const trend = new Trend({
            image: req.body.image,
            tags: req.body.tags || []
        });
        await trend.save();
        res.status(201).json(trend);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: all trends
router.get('/', async (req, res) => {
    try {
        const trends = await Trend.find();
        res.json(trends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
