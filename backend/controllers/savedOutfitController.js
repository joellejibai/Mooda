const SavedOutfit = require('../models/savedOutfitModel');
const mongoose = require('mongoose');

const saveOutfit = async (req, res) => {
  const user_id = req.user._id;
  const { top, bottom, foot } = req.body;

  try {
    const savedOutfit = await SavedOutfit.create({ user_id, top, bottom, foot });
    res.status(201).json(savedOutfit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSavedOutfits = async (req, res) => {
  const user_id = req.user._id;

  try {
    const outfits = await SavedOutfit.find({ user_id })
      .populate('top')
      .populate('bottom')
      .populate('foot')
      .sort({ createdAt: -1 });

    res.status(200).json(outfits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rateOutfit = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid outfit ID' });
  }

  try {
    const outfit = await SavedOutfit.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      { rating },
      { new: true }
    );
    if (!outfit) return res.status(404).json({ error: 'Outfit not found' });

    res.status(200).json(outfit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  saveOutfit,
  getSavedOutfits,
  rateOutfit,
};
