const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });  // Add timestamps to automatically track when messages are created or updated

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;
