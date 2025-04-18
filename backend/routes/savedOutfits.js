const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const SavedOutfit = require('../models/savedOutfitModel');
const {
  saveOutfit,
  getSavedOutfits,
  rateOutfit,
  planOutfit, // ✅ import
} = require('../controllers/savedOutfitController');

router.use(requireAuth);

router.post('/', saveOutfit);
router.get('/', getSavedOutfits);
router.patch('/:id/rating', rateOutfit);
router.patch('/:id/plan', planOutfit); // ✅ new route to save the date

router.delete('/:id', async (req, res) => {
  try {
    const outfit = await SavedOutfit.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!outfit) return res.status(404).json({ error: 'Outfit not found' });

    res.status(200).json({ message: 'Outfit deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
