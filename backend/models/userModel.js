const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Wardrobe = require('./Wardrobe'); // Import the Wardrobe model

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    wardrobe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wardrobe', // Reference to the Wardrobe model
    }
});

// Static signup method
userSchema.statics.signup = async function (email, password, gender) {
    if (!email || !password || !gender) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }
    if (!['male', 'female'].includes(gender)) {
        throw Error('Gender must be either "male" or "female"');
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash, gender });

    const wardrobe = await Wardrobe.create({ user: user._id });

    user.wardrobe = wardrobe._id;
    await user.save();

    return user;
};

// Static login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('incorrect email');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('incorrect password');
    }
    return user;
};

module.exports = mongoose.model('User', userSchema);
