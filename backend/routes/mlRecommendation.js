const express = require("express");
const router = express.Router();
const Item = require("../models/itemModel");
const UserStyle = require("../models/userStyleModel");
const { spawn } = require("child_process");

router.get("/ml/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const items = await Item.find({ user_id: userId });
        const userStyle = await UserStyle.findOne({ userId });

        if (!userStyle) {
            return res.status(400).json({ message: "Style preferences not found for this user." });
        }

        const python = spawn("python3", ["ml_recommender.py"]);

        const input = JSON.stringify({ userStyle, items });
        let output = "";

        python.stdin.write(input);
        python.stdin.end();

        python.stdout.on("data", (data) => {
            output += data.toString();
        });

        python.stderr.on("data", (err) => {
            console.error("Python error:", err.toString());
        });

        python.on("close", () => {
            try {
                const result = JSON.parse(output);
                res.json(result);
            } catch (err) {
                res.status(500).json({ message: "Error parsing ML output", raw: output });
            }
        });
    } catch (err) {
        console.error("ML Recommendation route error:", err);
        res.status(500).json({ message: "Something went wrong." });
    }
});

module.exports = router;
