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
        const trends = await Trend.find();
        let userStyle = await UserStyle.findOne({ userId });

        if (!userStyle) {
            userStyle = {
                style: "casual",
                colorPalette: "neutral",
                pattern: "none"
            };
        }

        const mlProcess = spawn("python", ["ml_recommender.py"]);
        const input = JSON.stringify({ userStyle, items, trends });
        let output = "";

        mlProcess.stdin.write(input);
        mlProcess.stdin.end();

        mlProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        mlProcess.stderr.on("data", (err) => {
            console.error("❌ ML stderr:", err.toString());
        });

        mlProcess.on("close", () => {
            let result;
            try {
                result = JSON.parse(output);
            } catch (err) {
                console.error("❌ ML JSON Parse Error:", output);
                return res.status(500).json({ message: "Failed to parse ML output", raw: output });
            }

            if (!result || result.error) {
                return res.status(400).json({ error: result?.error || "Unknown ML error." });
            }

            const top = result.recommended_wardrobe?.find(i =>
                i.category?.toLowerCase().match(/top|tshirt|hoodie|jacket|sweater|crop-top|tank-top|dress/)
            );
            const bottom = result.recommended_wardrobe?.find(i =>
                i.category?.toLowerCase().match(/pants|jeans|shorts|skirt|trousers|leggings|sweatpants/)
            );
            const foot = result.recommended_wardrobe?.find(i =>
                i.category?.toLowerCase().match(/shoes|sneakers|boots|heels|foot/)
            );

            const outfit = {
                top: `${top?.category || ''} in ${top?.color || ''}`,
                bottom: `${bottom?.category || ''} in ${bottom?.color || ''}`,
                foot: `${foot?.category || ''} in ${foot?.color || ''}`
            };

            const gptProcess = spawn("python", ["gpt_reasoning.py"]);
            const gptInput = JSON.stringify({ userStyle, outfit });
            let gptOutput = "";

            gptProcess.stdin.write(gptInput);
            gptProcess.stdin.end();

            gptProcess.stdout.on("data", (data) => {
                gptOutput += data.toString();
            });

            gptProcess.stderr.on("data", (err) => {
                console.error("❌ GPT stderr:", err.toString());
            });

            gptProcess.on("close", () => {
                try {
                    const gptResult = JSON.parse(gptOutput);
                    if (gptResult.error) {
                        console.warn("⚠️ GPT Reasoning Error:", gptResult.error);
                    }

                    res.json({
                        ...result,
                        reason: gptResult.reason || "This outfit matches your style and current trends."
                    });
                } catch (err) {
                    console.error("❌ GPT Parse Error:", gptOutput);
                    res.status(500).json({ message: "Failed to parse GPT output", raw: gptOutput });
                }
            });
        });
    } catch (err) {
        console.error("ML Recommendation route error:", err);
        res.status(500).json({ message: "Something went wrong in ML route." });
    }
});

module.exports = router;
