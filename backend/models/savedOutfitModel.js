const mongoose = require('mongoose');

const savedOutfitSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  top: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  bottom: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  foot: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  rating: { type: String, enum: ['up', 'down', null], default: null },
}, { timestamps: true });

module.exports = mongoose.model('SavedOutfit', savedOutfitSchema);
