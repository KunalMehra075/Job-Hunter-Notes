const express = require('express');
const router = express.Router();
const Variable = require('../models/Variable');

// Get all variables
router.get('/', async (req, res) => {
    try {
        const variables = await Variable.find({});
        res.json(variables);
    } catch (error) {
        console.error('Error fetching variables:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get variable by key
router.get('/:key', async (req, res) => {
    try {
        const variable = await Variable.findOne({ key: req.params.key });
        if (!variable) {
            return res.status(404).json({ message: 'Variable not found' });
        }
        res.json(variable);
    } catch (error) {
        console.error('Error fetching variable by key:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create or update variable
router.post('/', async (req, res) => {
    try {
        const { key, value, description } = req.body;

        const variable = await Variable.findOneAndUpdate(
            { key },
            { key, value, description },
            { upsert: true, new: true }
        );

        res.status(201).json(variable);
    } catch (error) {
        console.error('Error creating/updating variable:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update variable
router.put('/:key', async (req, res) => {
    try {
        const { value, description } = req.body;
        const variable = await Variable.findOneAndUpdate(
            { key: req.params.key },
            { value, description },
            { new: true }
        );

        if (!variable) {
            return res.status(404).json({ message: 'Variable not found' });
        }

        res.json(variable);
    } catch (error) {
        console.error('Error updating variable:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete variable
router.delete('/:key', async (req, res) => {
    try {
        const variable = await Variable.findOneAndDelete({ key: req.params.key });
        if (!variable) {
            return res.status(404).json({ message: 'Variable not found' });
        }
        res.json({ message: 'Variable deleted' });
    } catch (error) {
        console.error('Error deleting variable:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 