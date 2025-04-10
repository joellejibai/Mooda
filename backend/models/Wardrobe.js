const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wardrobeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    tops: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item' // Reference to the Item model
        }
    ],
    bottoms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    footwear: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Wardrobe', wardrobeSchema);
