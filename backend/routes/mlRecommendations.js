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
        let userStyle = await UserStyle.findOne({ userId });
        const trends = await Trend.find();

        if (!userStyle) {
            userStyle = { style: "casual", colorPalette: "neutral", pattern: "none" };
        }

        const py = spawn("python", ["ml_recommender.py"]);
        const input = JSON.stringify({ userStyle, items, trends });
        let output = "";

        py.stdin.write(input);
        py.stdin.end();

        py.stdout.on("data", data => { output += data.toString(); });
        py.stderr.on("data", err => { console.error("Python stderr:", err.toString()); });

        py.on("close", () => {
            try {
                console.log("Final Python output:\n", output);
                const result = JSON.parse(output);
                return res.json(result);
            } catch (e) {
                console.error("Parse error:", output);
                return res.status(500).json({ message: "Bad ML output", raw: output });
            }
        });

    } catch (err) {
        console.error("ML route error:", err);
        res.status(500).json({ message: "ML route failed." });
    }
});

module.exports = router;
