const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wardrobeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Wardrobe', wardrobeSchema);