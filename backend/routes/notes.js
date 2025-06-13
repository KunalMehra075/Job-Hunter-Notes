const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort({ order: 1 });
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new note
router.post('/', async (req, res) => {
    try {
        const { title, paragraph } = req.body;
        const lastNote = await Note.findOne().sort({ order: -1 });
        const order = lastNote ? lastNote.order + 1 : 0;

        const note = new Note({
            title,
            paragraph,
            order
        });

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(400).json({ message: error.message });
    }
});

// Reorder notes - This route must come before the update route
router.put('/reorder', async (req, res) => {
    try {
        const { notes } = req.body;

        // Update each note's order
        const updatePromises = notes.map(({ _id, order }) =>
            Note.findByIdAndUpdate(_id, { order }, { new: true })
        );

        await Promise.all(updatePromises);
        res.json({ message: 'Notes reordered successfully' });
    } catch (error) {
        console.error('Error reordering notes:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        const { title, paragraph } = req.body;
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { title, paragraph },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 