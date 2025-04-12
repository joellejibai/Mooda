const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    tags: [String], // Optional tags you might add later
}, { timestamps: true });

module.exports = mongoose.model('Trend', trendSchema);
