const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// One tag name per user (reusable across notes)
tagSchema.index({ userId: 1, name: 1 }, { unique: true });

// Upsert a list of tag names for a user (ignores duplicates)
tagSchema.statics.upsertMany = async function (userId, names = []) {
    const clean = [...new Set(
        names.map((n) => String(n).trim()).filter(Boolean)
    )];
    if (!clean.length) return;
    await Promise.all(
        clean.map((name) =>
            this.updateOne({ userId, name }, { $setOnInsert: { userId, name } }, { upsert: true })
        )
    );
};

module.exports = mongoose.model('Tag', tagSchema);
