const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/classify', async (req, res) => {
    const { imageBase64 } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Classify the clothing item in this image. What category is it (hoodie, pants, dress, etc.) and what color?" },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/png;base64,${imageBase64}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 100,
        });

        const result = response.choices[0].message.content;
        console.log("✅ OpenAI Result:", result);

        res.status(200).json({ result });

    } catch (err) {
        console.error("🔥 OpenAI Error:");
        console.error(err.response?.data || err.message || err);

        res.status(500).json({
            error: err.response?.data?.error?.message || "Failed to classify image",
        });
    }
});

module.exports = router;
