const express = require("express");
const router = express.Router();
const Item = require("../models/itemModel");
const UserStyle = require("../models/userStyleModel");
const Trend = require("../models/Trend");
const { spawn } = require("child_process");

router.get("/ml/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const items = await Item.find({ user_id: userId });
        const userStyle = await UserStyle.findOne({ userId });
        const trends = await Trend.find();

        if (!userStyle) {
            userStyle = {
                style: "casual",
                colorPalette: "neutral",
                pattern: "none"
            };
        }


        const py = spawn("python", ["ml_recommender.py"]); // ✅ not "python3" on Windows

        const input = JSON.stringify({ userStyle, items, trends });
        let output = "";

        py.stdin.write(input);
        py.stdin.end();

        py.stdout.on("data", (data) => {
            output += data.toString();
            console.log("🐍 Python output:", output); // ✅ Log Python output
        });

        py.stderr.on("data", (err) => {
            console.error("❌ Python stderr:", err.toString());
        });

        py.on("close", () => {
            try {
                const result = JSON.parse(output);
                res.json(result);
            } catch (err) {
                console.error("❌ Failed to parse Python output:", output);
                res.status(500).json({ message: "Failed to parse ML output", raw: output });
            }
        });
    } catch (err) {
        console.error("ML Recommendation route error:", err);
        res.status(500).json({ message: "Something went wrong in ML route." });
    }
});

module.exports = router;
