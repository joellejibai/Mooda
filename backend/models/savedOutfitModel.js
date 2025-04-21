// models/savedOutfitModel.js
const mongoose = require('mongoose');

const savedOutfitSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  top: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  bottom: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  foot: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  date: { type: Date, default: null },
  comment: { type: String, default: '' },
  plannedDate: { type: Date, unique: true }, // Add plannedDate field
}, { timestamps: true });

module.exports = mongoose.model('SavedOutfit', savedOutfitSchema);
