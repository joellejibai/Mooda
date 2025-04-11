const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Item', itemSchema)
