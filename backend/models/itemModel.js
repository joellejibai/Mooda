const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true // ✅ this is the one to keep
    },
    user_id: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true // ✅ still required
    },
}, { timestamps: true })


module.exports = mongoose.model('item', itemSchema)
