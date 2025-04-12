const mongoose = require('mongoose');

const userStyleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    style: {
        type: String,
        required: true
    },
    colorPalette: {
        type: String,
        required: true
    },
    pattern: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UserStyle', userStyleSchema);
