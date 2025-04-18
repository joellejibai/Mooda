
const mongoose = require('mongoose');


const SavedOutfit = require('../models/savedOutfitModel');

// Function to save the outfit (preserved)
const saveOutfit = async (req, res) => {
  const { top, bottom, foot, date } = req.body;

  try {
    const user_id = req.user._id;
    const outfit = await SavedOutfit.create({ user_id, top, bottom, foot, date });
    res.status(200).json(outfit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSavedOutfits = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the request (e.g., JWT token)
    
    // Fetch saved outfits associated with the logged-in user
    const outfits = await SavedOutfit.find({ user_id: userId })
      .populate('top') // If top, bottom, foot are references to other models (e.g., "Clothing" model)
      .populate('bottom')
      .populate('foot');
    
    if (!outfits) {
      return res.status(404).json({ error: 'No outfits found' });
    }

    // Return the outfits data
    res.json(outfits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to rate an outfit (preserved)
const rateOutfit = async (req, res) => {
  const { rating } = req.body;

  try {
    const outfit = await SavedOutfit.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!outfit) {
      return res.status(404).json({ error: 'Outfit not found' });
    }

    outfit.rating = rating;

    await outfit.save();

    res.status(200).json(outfit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// New function to update the date for an existing outfit (added)
const planOutfit = async (req, res) => {
  const { date } = req.body;
  const { id } = req.params;

  try {
    const outfit = await SavedOutfit.findOne({ _id: id, user_id: req.user._id });

    if (!outfit) {
      return res.status(404).json({ error: 'Outfit not found' });
    }

    // Update only the date for the outfit, not the entire outfit details
    outfit.date = date;

    await outfit.save(); // Save the updated outfit with the new date

    res.status(200).json(outfit); // Return the updated outfit with the saved date
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { saveOutfit, getSavedOutfits, rateOutfit, planOutfit };
