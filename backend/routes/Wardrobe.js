const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { getWardrobe, addItem } = require('../controllers/wardrobeController');
const router = express.Router();

// Require auth for all wardrobe routes
router.use(requireAuth);

router.get('/', getWardrobe);
router.post('/items', addItem);

module.exports = router;