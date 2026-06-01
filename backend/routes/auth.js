const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/users.js');
const Variable = require('../models/variables.js');
const auth = require('../middleware/auth.js');
const dotenv = require('dotenv');

dotenv.config();

const ADJECTIVES = ['Brave', 'Calm', 'Clever', 'Bright', 'Bold', 'Swift', 'Lucky', 'Quiet', 'Gentle', 'Witty'];
const NOUNS = ['Otter', 'Falcon', 'Maple', 'River', 'Comet', 'Cedar', 'Sparrow', 'Fox', 'Willow', 'Heron'];

const randomName = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj}${noun}${Math.floor(Math.random() * 100)}`;
};

const issueToken = (user) =>
    jwt.sign(
        { userId: user._id, name: `${user.firstName} ${user.lastName}`.trim() },
        process.env.JWT_SECRET
    );

const userPayload = (user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
});

// Passwordless login: find user by email, or create one on the fly
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            user = await User.create({
                firstName: randomName(),
                lastName: '',
                email: normalizedEmail,
            });

            // Seed default variables for the brand new user
            await Variable.insertMany(
                Variable.DEFAULT_VARS.map((d, i) => ({ ...d, userId: user._id, order: i }))
            );
        }

        res.json({
            message: 'Logged in successfully',
            token: issueToken(user),
            user: userPayload(user),
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error in /me route:', error);
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
});

// Update display name
router.put('/profile', auth, async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;

        await user.save();

        res.json({
            token: issueToken(user),
            user: userPayload(user),
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
