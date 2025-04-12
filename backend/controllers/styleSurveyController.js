const StyleSurvey = require('../models/styleSurveyModel');

const submitSurvey = async (req, res) => {
  const { style, colorPalette, pattern } = req.body;

  try {
    const user_id = req.user._id;
    const survey = await StyleSurvey.create({ user_id, style, colorPalette, pattern });
    res.status(200).json(survey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { submitSurvey };
