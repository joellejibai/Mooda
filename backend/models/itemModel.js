const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    image: {
        type: String // This will hold the base64 image
    },
    user_id: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: false
    },
    size: {
        type: String,
        required: false
    },
    meterial: {
        type: String,
        required: false
    },
    fit: {
        type: String,
        required: false
    },
    imageURL: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('item', itemSchema)
