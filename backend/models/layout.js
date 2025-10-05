const mongoose = require('mongoose');

const layoutSchema = new mongoose.Schema({
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    x: {
        type: Number,
        required: true,
        default: 0
    },
    y: {
        type: Number,
        required: true,
        default: 0
    },
    width: {
        type: Number,
        required: true,
        default: 3
    },
    height: {
        type: Number,
        required: true,
        default: 4
    },
    minWidth: {
        type: Number,
        default: 3
    },
    minHeight: {
        type: Number,
        default: 4
    },
    maxWidth: {
        type: Number,
        default: null
    },
    maxHeight: {
        type: Number,
        default: null
    },
    isDraggable: {
        type: Boolean,
        default: true
    },
    isResizable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create compound index for efficient queries
layoutSchema.index({ userId: 1, noteId: 1 }, { unique: true });

// Instance method to convert to grid layout format
layoutSchema.methods.toGridLayout = function () {
    return {
        i: this.noteId.toString(),
        x: this.x,
        y: this.y,
        w: this.width,
        h: this.height,
        minW: this.minWidth,
        minH: this.minHeight,
        maxW: this.maxWidth,
        maxH: this.maxHeight,
        isDraggable: this.isDraggable,
        isResizable: this.isResizable
    };
};

// Static method to create from grid layout format
layoutSchema.statics.fromGridLayout = function (gridItem, userId, noteId) {
    return new this({
        noteId: noteId,
        userId: userId,
        x: gridItem.x,
        y: gridItem.y,
        width: gridItem.w,
        height: gridItem.h,
        minWidth: gridItem.minW || 3,
        minHeight: gridItem.minH || 4,
        maxWidth: gridItem.maxW || null,
        maxHeight: gridItem.maxH || null,
        isDraggable: gridItem.isDraggable !== undefined ? gridItem.isDraggable : true,
        isResizable: gridItem.isResizable !== undefined ? gridItem.isResizable : true
    });
};

// Static method to get default layout for a note
layoutSchema.statics.getDefaultLayout = function (noteId, userId, index = 0) {
    const cols = 12; // 12-column grid system
    const cardWidth = 3;
    const cardHeight = 4;
    const x = (index * cardWidth) % cols;
    const y = Math.floor((index * cardWidth) / cols) * cardHeight;

    return new this({
        noteId: noteId,
        userId: userId,
        x: x,
        y: y,
        width: cardWidth,
        height: cardHeight,
        minWidth: 3,
        minHeight: 4,
        maxWidth: 12,
        isDraggable: true,
        isResizable: true
    });
};

module.exports = mongoose.model('Layout', layoutSchema);
