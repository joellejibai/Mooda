const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Function to create JWT token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({
            email: user.email,
            token,
            _id: user._id,
            profilePic: user.profilePic || '',
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Sign up user
const signupUser = async (req, res) => {
    const { email, password, gender } = req.body;

    try {
        const user = await User.signup(email, password, gender);
        const token = createToken(user._id);
        res.status(201).json({
            email: user.email,
            token,
            _id: user._id,
            profilePic: user.profilePic || '',
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// Upload profile picture
const uploadProfilePic = async (req, res) => {
    try {
        const userId = req.user._id;
        const imageUrl = `/uploads/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: imageUrl },
            { new: true }
        );

        res.status(200).json({ profilePicUrl: updatedUser.profilePic });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to upload profile picture.' });
    }
};

module.exports = {
    signupUser,
    loginUser,
    upload,
    uploadProfilePic,
};
