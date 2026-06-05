const express = require('express');
const router = express.Router();
const Tag = require('../models/tags.js');

// List the current user's tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find({ userId: req.user.userId }).sort({ name: 1 });
        res.json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create / ensure a tag exists for the user
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Tag name is required' });
        }
        const tag = await Tag.findOneAndUpdate(
            { userId: req.user.userId, name: name.trim() },
            { $setOnInsert: { userId: req.user.userId, name: name.trim() } },
            { upsert: true, new: true }
        );
        res.status(201).json(tag);
    } catch (error) {
        console.error('Error creating tag:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a tag (does not remove it from existing notes)
router.delete('/:id', async (req, res) => {
    try {
        const tag = await Tag.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!tag) return res.status(404).json({ message: 'Tag not found' });
        res.json({ message: 'Tag deleted' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
