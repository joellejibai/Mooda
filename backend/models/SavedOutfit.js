const mongoose = require('mongoose');

const SavedOutfitSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  top: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    image: String,
  },
  bottom: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    image: String,
  },
  foot: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    image: String,
  },
  date: {
    type: Date,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
});

module.exports = mongoose.model('SavedOutfit', SavedOutfitSchema);
