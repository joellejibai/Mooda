const express = require('express');
const { submitSurvey } = require('../controllers/styleSurveyController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth); // Auth middleware

router.post('/', submitSurvey);

module.exports = router;
