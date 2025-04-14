const mongoose = require("mongoose");

const ProfilePicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  image: {
    type: String, // base64-encoded image
    required: true,
  },
});

module.exports = mongoose.model("ProfilePic", ProfilePicSchema);
