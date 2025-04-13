const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {
    signupUser,
    loginUser,
    upload,
    uploadProfilePic,
} = require('../controllers/userController');

// Signup route
router.post('/signup', signupUser);

// Login route
router.post('/login', loginUser);

// Upload profile picture
router.post(
    '/profile-pic',
    requireAuth,
    upload.single('profilePic'),
    uploadProfilePic
);

module.exports = router;
