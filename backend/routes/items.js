const express = require('express');
const {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem
} = require('../controllers/itemController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Apply authentication to all item routes
router.use(requireAuth);

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', createItem);
router.delete('/:id', deleteItem);
router.patch('/:id', updateItem);

module.exports = router;
