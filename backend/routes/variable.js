const express = require('express');
const router = express.Router();
const Variable = require('../models/variables.js');

// Get all variables for the current user (seed defaults if none exist)
router.get('/', async (req, res) => {
    try {
        let variables = await Variable.find({ userId: req.user.userId }).sort({ order: 1 });

        if (variables.length === 0) {
            await Variable.insertMany(
                Variable.DEFAULT_VARS.map((d, i) => ({ ...d, userId: req.user.userId, order: i }))
            );
            variables = await Variable.find({ userId: req.user.userId }).sort({ order: 1 });
        }

        res.json(variables);
    } catch (error) {
        console.error('Error fetching variables:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new variable
router.post('/', async (req, res) => {
    try {
        const { key, value = '', color = '#22c55e' } = req.body;

        if (!key || !key.trim()) {
            return res.status(400).json({ message: 'Variable key is required' });
        }

        const last = await Variable.findOne({ userId: req.user.userId }).sort({ order: -1 });
        const order = last ? last.order + 1 : 0;

        const variable = await Variable.create({
            userId: req.user.userId,
            key: key.trim(),
            value,
            color,
            order,
        });

        res.status(201).json(variable);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Variable already exists' });
        }
        console.error('Error creating variable:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update a variable (value / key / color)
router.put('/:id', async (req, res) => {
    try {
        const { key, value, color } = req.body;
        const update = {};
        if (key !== undefined) update.key = key.trim();
        if (value !== undefined) update.value = value;
        if (color !== undefined) update.color = color;

        const variable = await Variable.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            update,
            { new: true }
        );

        if (!variable) {
            return res.status(404).json({ message: 'Variable not found' });
        }

        res.json(variable);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Variable already exists' });
        }
        console.error('Error updating variable:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a variable
router.delete('/:id', async (req, res) => {
    try {
        const variable = await Variable.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!variable) {
            return res.status(404).json({ message: 'Variable not found' });
        }
        res.json({ message: 'Variable deleted' });
    } catch (error) {
        console.error('Error deleting variable:', error);
        res.status(500).json({ message: error.message });
    }
});

// Reorder variables
router.put('/reorder/all', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: 'ids array is required' });
        }

        await Promise.all(
            ids.map((id, index) =>
                Variable.findOneAndUpdate(
                    { _id: id, userId: req.user.userId },
                    { order: index }
                )
            )
        );

        const variables = await Variable.find({ userId: req.user.userId }).sort({ order: 1 });
        res.json(variables);
    } catch (error) {
        console.error('Error reordering variables:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
