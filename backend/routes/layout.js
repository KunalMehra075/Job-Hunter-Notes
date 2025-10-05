const express = require('express');
const router = express.Router();
const Layout = require('../models/layout.js');
const Note = require('../models/notes.js');

// Get all layouts for the current user
router.get('/', async (req, res) => {
    try {
        console.log({ fetching: "layouts" })
        const layouts = await Layout.find({ userId: req.user.userId })
            .populate('noteId', 'title paragraph')
            .sort({ createdAt: 1 });
        console.log({ layouts: layouts.length, oneLayout: layouts[0] });
        // Convert to grid layout format
        const gridLayouts = layouts.map(layout => ({
            id: layout._id,
            noteId: layout.noteId._id,
            i: layout.noteId._id.toString(),
            x: layout.x,
            y: layout.y,
            w: layout.width,
            h: layout.height,
            minW: layout.minWidth,
            minH: layout.minHeight,
            maxW: layout.maxWidth,
            maxH: layout.maxHeight,
            isDraggable: layout.isDraggable,
            isResizable: layout.isResizable,
            note: {
                title: layout.noteId.title,
                paragraph: layout.noteId.paragraph
            }
        }));

        return res.json(gridLayouts);
    } catch (error) {
        console.error('Error fetching layouts:', error);
        return res.status(500).json({ message: 'Error fetching layouts' });
    }
});

// Get layout for a specific note
router.get('/note/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;

        const layout = await Layout.findOne({
            userId: req.user.userId,
            noteId: noteId
        });

        if (!layout) {
            return res.status(404).json({ message: 'Layout not found' });
        }

        // Store the original noteId before population
        const originalNoteId = layout.noteId;
        await layout.populate('noteId', 'title paragraph');

        const gridLayout = {
            id: layout._id,
            noteId: originalNoteId,
            i: originalNoteId.toString(),
            x: layout.x,
            y: layout.y,
            w: layout.width,
            h: layout.height,
            minW: layout.minWidth,
            minH: layout.minHeight,
            maxW: layout.maxWidth,
            maxH: layout.maxHeight,
            isDraggable: layout.isDraggable,
            isResizable: layout.isResizable,
            note: {
                title: layout.noteId.title,
                paragraph: layout.noteId.paragraph
            }
        };

        res.json(gridLayout);
    } catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).json({ message: 'Error fetching layout' });
    }
});

// Create a new layout
router.post('/', async (req, res) => {
    try {
        const { noteId, x, y, width, height, minWidth, minHeight, maxWidth, maxHeight, isDraggable, isResizable } = req.body;

        if (!noteId) {
            return res.status(400).json({ message: 'Note ID is required' });
        }

        // Verify the note exists and belongs to the user
        const note = await Note.findOne({ _id: noteId, user: req.user.userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if layout already exists for this note
        const existingLayout = await Layout.findOne({
            userId: req.user.userId,
            noteId: noteId
        });

        if (existingLayout) {
            return res.status(400).json({ message: 'Layout already exists for this note' });
        }

        const layout = new Layout({
            noteId,
            userId: req.user.userId,
            x: x || 0,
            y: y || 0,
            width: width || 1,
            height: height || 1,
            minWidth: minWidth || 1,
            minHeight: minHeight || 1,
            maxWidth: maxWidth || null,
            maxHeight: maxHeight || null,
            isDraggable: isDraggable !== undefined ? isDraggable : true,
            isResizable: isResizable !== undefined ? isResizable : true
        });

        await layout.save();

        // Store the original noteId before population
        const originalNoteId = layout.noteId;
        await layout.populate('noteId', 'title paragraph');

        const gridLayout = {
            id: layout._id,
            noteId: originalNoteId,
            i: originalNoteId.toString(),
            x: layout.x,
            y: layout.y,
            w: layout.width,
            h: layout.height,
            minW: layout.minWidth,
            minH: layout.minHeight,
            maxW: layout.maxWidth,
            maxH: layout.maxHeight,
            isDraggable: layout.isDraggable,
            isResizable: layout.isResizable,
            note: {
                title: layout.noteId.title,
                paragraph: layout.noteId.paragraph
            }
        };

        res.status(201).json(gridLayout);
    } catch (error) {
        console.error('Error creating layout:', error);
        res.status(500).json({ message: 'Error creating layout' });
    }
});

// Batch update layouts
router.put('/batch', async (req, res) => {
    try {
        const { layouts } = req.body;

        if (!Array.isArray(layouts)) {
            return res.status(400).json({ message: 'Layouts must be an array' });
        }

        const updatedLayouts = [];

        for (const layoutData of layouts) {
            const { noteId, x, y, width, height } = layoutData;

            if (!noteId) continue;

            let layout = await Layout.findOne({
                userId: req.user.userId,
                noteId: noteId
            });

            if (layout) {
                // Update existing layout with minimum constraints
                layout.x = x !== undefined ? x : layout.x;
                layout.y = y !== undefined ? y : layout.y;
                layout.width = width !== undefined ? Math.max(width, 3) : layout.width; // Enforce min width of 3
                layout.height = height !== undefined ? Math.max(height, 4) : layout.height; // Enforce min height of 4
                await layout.save();
            } else {
                // Create new layout with minimum constraints
                layout = new Layout({
                    noteId,
                    userId: req.user.userId,
                    x: x || 0,
                    y: y || 0,
                    width: Math.max(width || 3, 3), // Enforce min width of 3
                    height: Math.max(height || 4, 4) // Enforce min height of 4
                });
                await layout.save();
            }

            // Store the original noteId before population
            const originalNoteId = layout.noteId;
            await layout.populate('noteId', 'title paragraph');

            updatedLayouts.push({
                id: layout._id,
                noteId: originalNoteId,
                i: originalNoteId.toString(),
                x: layout.x,
                y: layout.y,
                w: layout.width,
                h: layout.height,
                minW: layout.minWidth,
                minH: layout.minHeight,
                maxW: layout.maxWidth,
                maxH: layout.maxHeight,
                isDraggable: layout.isDraggable,
                isResizable: layout.isResizable,
                note: {
                    title: layout.noteId.title,
                    paragraph: layout.noteId.paragraph
                }
            });
        }

        res.json(updatedLayouts);
    } catch (error) {
        console.error('Error batch updating layouts:', error);
        res.status(500).json({ message: 'Error batch updating layouts' });
    }
});

// Update a layout
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { x, y, width, height, minWidth, minHeight, maxWidth, maxHeight, isDraggable, isResizable } = req.body;

        const layout = await Layout.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!layout) {
            return res.status(404).json({ message: 'Layout not found' });
        }

        // Update fields if provided
        if (x !== undefined) layout.x = x;
        if (y !== undefined) layout.y = y;
        if (width !== undefined) layout.width = width;
        if (height !== undefined) layout.height = height;
        if (minWidth !== undefined) layout.minWidth = minWidth;
        if (minHeight !== undefined) layout.minHeight = minHeight;
        if (maxWidth !== undefined) layout.maxWidth = maxWidth;
        if (maxHeight !== undefined) layout.maxHeight = maxHeight;
        if (isDraggable !== undefined) layout.isDraggable = isDraggable;
        if (isResizable !== undefined) layout.isResizable = isResizable;

        await layout.save();

        // Store the original noteId before population
        const originalNoteId = layout.noteId;
        await layout.populate('noteId', 'title paragraph');

        const gridLayout = {
            id: layout._id,
            noteId: originalNoteId,
            i: originalNoteId.toString(),
            x: layout.x,
            y: layout.y,
            w: layout.width,
            h: layout.height,
            minW: layout.minWidth,
            minH: layout.minHeight,
            maxW: layout.maxWidth,
            maxH: layout.maxHeight,
            isDraggable: layout.isDraggable,
            isResizable: layout.isResizable,
            note: {
                title: layout.noteId.title,
                paragraph: layout.noteId.paragraph
            }
        };

        res.json(gridLayout);
    } catch (error) {
        console.error('Error updating layout:', error);
        res.status(500).json({ message: 'Error updating layout' });
    }
});

// Delete a layout
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const layout = await Layout.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!layout) {
            return res.status(404).json({ message: 'Layout not found' });
        }

        res.json({ message: 'Layout deleted successfully', id: layout._id });
    } catch (error) {
        console.error('Error deleting layout:', error);
        res.status(500).json({ message: 'Error deleting layout' });
    }
});

// Delete layout by note ID
router.delete('/note/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;

        const layout = await Layout.findOneAndDelete({
            userId: req.user.userId,
            noteId: noteId
        });

        if (!layout) {
            return res.status(404).json({ message: 'Layout not found' });
        }

        res.json({ message: 'Layout deleted successfully', id: layout._id });
    } catch (error) {
        console.error('Error deleting layout:', error);
        res.status(500).json({ message: 'Error deleting layout' });
    }
});

// Reset all layouts to default positions
router.post('/reset', async (req, res) => {
    try {
        // Delete all existing layouts for the user
        await Layout.deleteMany({ userId: req.user.userId });

        // Get all user's notes
        const notes = await Note.find({ user: req.user.userId }).sort({ createdAt: -1 });

        // Create default layouts
        const defaultLayouts = [];
        for (let i = 0; i < notes.length; i++) {
            const layout = Layout.getDefaultLayout(notes[i]._id, req.user.userId, i);
            await layout.save();

            // Store the original noteId before population
            const originalNoteId = layout.noteId;
            await layout.populate('noteId', 'title paragraph');

            defaultLayouts.push({
                id: layout._id,
                noteId: originalNoteId,
                i: originalNoteId.toString(),
                x: layout.x,
                y: layout.y,
                w: layout.width,
                h: layout.height,
                minW: layout.minWidth,
                minH: layout.minHeight,
                maxW: layout.maxWidth,
                maxH: layout.maxHeight,
                isDraggable: layout.isDraggable,
                isResizable: layout.isResizable,
                note: {
                    title: layout.noteId.title,
                    paragraph: layout.noteId.paragraph
                }
            });
        }

        res.json(defaultLayouts);
    } catch (error) {
        console.error('Error resetting layouts:', error);
        res.status(500).json({ message: 'Error resetting layouts' });
    }
});

// Fix existing layouts to enforce minimum constraints
router.post('/fix-constraints', async (req, res) => {
    try {
        // Find all layouts for the user that don't meet minimum constraints
        const layouts = await Layout.find({
            userId: req.user.userId,
            $or: [
                { width: { $lt: 3 } },
                { height: { $lt: 4 } }
            ]
        });

        const fixedLayouts = [];

        for (const layout of layouts) {
            // Update layout to meet minimum constraints
            layout.width = Math.max(layout.width, 3);
            layout.height = Math.max(layout.height, 4);
            await layout.save();

            // Store the original noteId before population
            const originalNoteId = layout.noteId;
            await layout.populate('noteId', 'title paragraph');

            fixedLayouts.push({
                id: layout._id,
                noteId: originalNoteId,
                i: originalNoteId.toString(),
                x: layout.x,
                y: layout.y,
                w: layout.width,
                h: layout.height,
                minW: layout.minWidth,
                minH: layout.minHeight,
                maxW: layout.maxWidth,
                maxH: layout.maxHeight,
                isDraggable: layout.isDraggable,
                isResizable: layout.isResizable,
                note: {
                    title: layout.noteId.title,
                    paragraph: layout.noteId.paragraph
                }
            });
        }

        res.json({
            message: `Fixed ${fixedLayouts.length} layouts`,
            layouts: fixedLayouts
        });
    } catch (error) {
        console.error('Error fixing layout constraints:', error);
        res.status(500).json({ message: 'Error fixing layout constraints' });
    }
});

module.exports = router;
