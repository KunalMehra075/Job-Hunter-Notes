const express = require('express');
const notesRouter = express.Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort({ order: 1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

notesRouter.post('/', async (req, res) => {
    const note = new Note({
        title: req.body.title,
        paragraph: req.body.paragraph,
        order: await Note.countDocuments(), // Set order to the last position
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a note
notesRouter.put('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.title = req.body.title;
        note.paragraph = req.body.paragraph;
        note.updatedAt = Date.now();

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

notesRouter.put('/reorder', async (req, res) => {
    try {
        const { notes } = req.body;

        // Update each note's order
        await Promise.all(
            notes.map(({ _id, order }) =>
                Note.findByIdAndUpdate(_id, { order })
            )
        );

        res.json({ message: 'Notes reordered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a note
notesRouter.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await note.deleteOne();
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = notesRouter; 