const Wardrobe = require('../models/Wardrobe');
const ClothingItem = require('../models/ClothingItem');

const getWardrobe = async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findOne({ user: req.user._id })
      .populate('items');
    
    if (!wardrobe) {
      return res.status(404).json({ error: 'Wardrobe not found' });
    }
    
    res.status(200).json(wardrobe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addItem = async (req, res) => {
  const { name, type, color, image } = req.body;
  
  try {
    // Find user's wardrobe
    const wardrobe = await Wardrobe.findOne({ user: req.user._id });
    
    if (!wardrobe) {
      return res.status(404).json({ error: 'Wardrobe not found' });
    }
    
    // Create new clothing item
    const item = await ClothingItem.create({
      name,
      type,
      color,
      image,
      wardrobe: wardrobe._id
    });
    
    // Add item to wardrobe
    wardrobe.items.push(item._id);
    await wardrobe.save();
    
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getWardrobe, addItem };