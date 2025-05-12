// ✅ FINAL PROFILE PIC ROUTE (compatible with your frontend and base64 approach)
const express = require("express");
const router = express.Router();
const ProfilePic = require("../models/ProfilePic");
const requireAuth = require("../middleware/requireAuth");

// ✅ Protect all routes
router.use(requireAuth);

// 📤 Save or update profile picture using base64
router.post("/", async (req, res) => {
  const userId = req.user._id;
  const { image } = req.body;

  if (!image || !image.startsWith("data:image")) {
    return res.status(400).json({ error: "Invalid image format" });
  }

  try {
    const updatedPic = await ProfilePic.findOneAndUpdate(
      { userId },
      { image },
      { new: true, upsert: true } // Create or update
    );
    res.status(200).json({ message: "Profile picture saved", pic: updatedPic });
  } catch (err) {
    console.error("Error saving profile picture:", err);
    res.status(500).json({ error: "Failed to save profile picture" });
  }
});

// 📥 Fetch profile picture for current user
router.get("/", async (req, res) => {
  const userId = req.user._id;
  try {
    const profilePic = await ProfilePic.findOne({ userId });
    if (!profilePic) return res.json({ image: null });
    res.json({ image: profilePic.image });
  } catch (err) {
    console.error("Error fetching profile picture:", err);
    res.status(500).json({ error: "Failed to fetch profile picture" });
  }
});

module.exports = router;
