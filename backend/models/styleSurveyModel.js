const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const styleSurveySchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  colorPalette: {
    type: String,
    required: true,
  },
  pattern: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('StyleSurvey', styleSurveySchema);
