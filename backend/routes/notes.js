const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes for the current user
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.userId }).sort({ order: 1 });
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

// Create a new note
router.post('/', async (req, res) => {
    try {
        const { title, paragraph } = req.body;
        const lastNote = await Note.findOne({ user: req.user.userId }).sort({ order: -1 });
        const order = lastNote ? lastNote.order + 1 : 0;

        const note = new Note({
            title,
            paragraph,
            order,
            user: req.user.userId
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(400).json({ message: error.message });
    }
});

// Reorder notes
router.put('/reorder', async (req, res) => {
    try {
        const { notes } = req.body;

        // Update each note's order
        const updatePromises = notes.map((noteId, index) =>
            Note.findOneAndUpdate(
                { _id: noteId, user: req.user.userId },
                { order: index },
                { new: true }
            )
        );

        await Promise.all(updatePromises);
        const updatedNotes = await Note.find({ user: req.user.userId }).sort({ order: 1 });
        res.json(updatedNotes);
    } catch (error) {
        console.error('Error reordering notes:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        const { title, paragraph } = req.body;
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
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
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Update order for remaining notes
        await Note.updateMany(
            { user: req.user.userId, order: { $gt: note.order } },
            { $inc: { order: -1 } }
        );

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 