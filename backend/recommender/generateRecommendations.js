const Item = require('../models/itemModel');
const Trend = require('../models/Trend');

// Very simple recommendation logic: match tags
async function generateRecommendations(userItems) {
    try {
        const trends = await Trend.find();
        const recommendations = [];

        for (const trend of trends) {
            for (const item of userItems) {
                if (trend.tags.some(tag => item.tags.includes(tag))) {
                    recommendations.push({
                        trendImage: trend.image,
                        matchedItem: item
                    });
                }
            }
        }

        return recommendations;
    } catch (err) {
        console.error('❌ Error generating recommendations:', err);
        throw err;
    }
}

module.exports = generateRecommendations;
