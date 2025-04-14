const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Using memory storage
const ProfilePic = require("../models/ProfilePic");

router.post("/", upload.single("profilePic"), async (req, res) => {
  const userId = req.user._id;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const base64Image = req.file.buffer.toString("base64");

  try {
    // Upsert: Create or update profile picture for the user
    const updatedPic = await ProfilePic.findOneAndUpdate(
      { userId },
      { image: base64Image },
      { new: true, upsert: true }
    );
    res.json({ message: "Profile picture saved", pic: updatedPic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save profile picture" });
  }
});

// Fetch profile picture for a user
router.get("/", async (req, res) => {
  const userId = req.user._id;
  try {
    const profilePic = await ProfilePic.findOne({ userId });
    if (!profilePic) {
      return res.status(404).json({ error: "Profile picture not found" });
    }
    res.json({ image: profilePic.image });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile picture" });
  }
});

module.exports = router;
