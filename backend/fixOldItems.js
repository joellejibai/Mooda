const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Item = require('./models/itemModel'); 

function generateTags(category, color) {
  const tags = [];

  if (category) tags.push(category.toLowerCase());
  if (color) tags.push(color.toLowerCase());

  switch (category?.toLowerCase()) {
    case "hoodie":
      tags.push("casual", "comfy", "oversized", "cozy", "streetwear");
      break;
    case "heels":
      tags.push("chic", "formal", "elegant", "night-out", "statement");
      break;
    case "jeans":
      tags.push("denim", "dailywear", "casual", "relaxed", "neutral");
      break;
    case "jacket":
      tags.push("layered", "outerwear", "cool-weather", "bold", "winter");
      break;
    case "crop-top":
      tags.push("y2k", "feminine", "trendy", "youthful", "party");
      break;
    case "sneakers":
      tags.push("sporty", "active", "daily", "versatile", "youthful");
      break;
    case "trousers":
      tags.push("classic", "neutral", "business", "clean", "elegant");
      break;
    case "dress":
      tags.push("feminine", "chic", "formal", "effortless", "elevated");
      break;
    case "tank-top":
      tags.push("minimal", "summer", "casual", "lightwear");
      break;
    case "boots":
      tags.push("edgy", "fall", "layered", "powerful", "strong");
      break;
  }

  switch (color?.toLowerCase()) {
    case "black":
      tags.push("minimal", "luxury", "classic", "timeless");
      break;
    case "white":
      tags.push("clean", "fresh", "neutral", "basic");
      break;
    case "beige":
      tags.push("neutral", "earthy", "elegant");
      break;
    case "pink":
      tags.push("feminine", "cute", "romantic");
      break;
    case "blue":
      tags.push("cool", "calm", "casual");
      break;
    case "green":
      tags.push("nature", "fresh", "earthy");
      break;
    case "red":
      tags.push("bold", "statement", "powerful");
      break;
  }

  return [...new Set(tags)];
}

// 🛠️ Main Fix Function
const fixOldItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("🔌 Connected to MongoDB");

    const outdatedItems = await Item.find({
      $or: [{ tags: { $exists: false } }, { tags: { $size: 0 } }]
    });

    console.log(`🧺 Found ${outdatedItems.length} items missing tags`);

    for (const item of outdatedItems) {
      const tags = generateTags(item.category, item.color);
      item.tags = tags;
      await item.save();
      console.log(`✅ Fixed item ${item._id} with tags:`, tags);
    }

    console.log("🎉 Done fixing old items!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing items:", err);
    process.exit(1);
  }
};

fixOldItems();
