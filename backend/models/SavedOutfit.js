const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedOutfitSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  top: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  bottom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  foot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  rating: {
    type: String, // "up" | "down" | null
    enum: ['up', 'down', null],
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('SavedOutfit', savedOutfitSchema);
